import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { AppUser, AuthResult, RegisterRequest, RegisterResult, Session } from '../models/auth.models';
import { AuditLogService } from './audit-log.service';
import { MOCK_USERS } from './mock-seed';

const USERS_KEY = 'expense-tracker.users';
const SESSION_KEY = 'expense-tracker.session';
const VERIFICATION_KEY = 'expense-tracker.verification-tokens';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public constructor(private readonly auditLogService: AuditLogService) {
    this.seedUsersIfMissing();
  }

  public register(request: RegisterRequest): Observable<RegisterResult> {
    const users = this.getUsers();
    const emailExists = users.some((user) => user.email.toLowerCase() === request.email.toLowerCase());

    if (emailExists) {
      return throwError(() => new Error('Email already exists. Please use a different email.'));
    }

    const now = new Date().toISOString();
    const createdUser: AppUser = {
      userId: `u-${crypto.randomUUID()}`,
      fullName: request.fullName,
      email: request.email,
      passwordHash: request.password,
      role: 'User',
      isEmailVerified: false,
      status: 'Active',
      createdAt: now,
      updatedAt: now
    };

    users.push(createdUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenMap = this.getVerificationTokens();
    tokenMap[createdUser.email.toLowerCase()] = verificationToken;
    localStorage.setItem(VERIFICATION_KEY, JSON.stringify(tokenMap));

    this.auditLogService.appendLog({
      eventType: 'Authentication',
      actorUserId: createdUser.userId,
      actorRole: createdUser.role,
      entityType: 'User',
      entityId: createdUser.userId,
      action: 'Register',
      metadata: `User registered with verification pending for ${createdUser.email}`
    });

    return of({
      userId: createdUser.userId,
      verificationStatus: 'Pending',
      createdAt: now,
      verificationToken
    });
  }

  public verifyEmail(email: string, verificationToken: string): Observable<{ verificationStatus: 'Verified'; verifiedAt: string }> {
    const tokenMap = this.getVerificationTokens();
    const normalizedEmail = email.toLowerCase();
    const expectedToken = tokenMap[normalizedEmail];

    if (!expectedToken || expectedToken !== verificationToken) {
      return throwError(() => new Error('Invalid verification token.'));
    }

    const users = this.getUsers();
    const user = users.find((entry) => entry.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return throwError(() => new Error('User not found for verification.'));
    }

    user.isEmailVerified = true;
    user.updatedAt = new Date().toISOString();
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    delete tokenMap[normalizedEmail];
    localStorage.setItem(VERIFICATION_KEY, JSON.stringify(tokenMap));

    const verifiedAt = new Date().toISOString();
    this.auditLogService.appendLog({
      eventType: 'Authentication',
      actorUserId: user.userId,
      actorRole: user.role,
      entityType: 'User',
      entityId: user.userId,
      action: 'VerifyEmail',
      metadata: `Email verified for ${user.email}`
    });

    return of({ verificationStatus: 'Verified', verifiedAt });
  }

  public login(email: string, password: string): Observable<AuthResult> {
    const users = this.getUsers();
    const normalizedEmail = email.toLowerCase();
    const user = users.find((entry) => entry.email.toLowerCase() === normalizedEmail && entry.passwordHash === password);

    if (!user) {
      this.auditLogService.appendLog({
        eventType: 'Security',
        actorUserId: 'anonymous',
        actorRole: 'Unknown',
        entityType: 'Session',
        entityId: 'n/a',
        action: 'LoginFailed',
        metadata: `Failed login attempt for ${email}`
      });

      return throwError(() => new Error('Invalid email or password.'));
    }

    if (!user.isEmailVerified) {
      return throwError(() => new Error('Email is not verified. Complete verification before login.'));
    }

    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 30 * 60 * 1000);
    const session: Session = {
      sessionId: `s-${crypto.randomUUID()}`,
      userId: user.userId,
      accessToken: `mock-token-${crypto.randomUUID()}`,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: true
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    user.lastLoginAt = issuedAt.toISOString();
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    this.auditLogService.appendLog({
      eventType: 'Authentication',
      actorUserId: user.userId,
      actorRole: user.role,
      entityType: 'Session',
      entityId: session.sessionId,
      action: 'LoginSuccess',
      metadata: `Login successful for ${user.email}`
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return of({
      accessToken: session.accessToken,
      tokenType: 'Bearer',
      expiresAt: session.expiresAt,
      user: safeUser
    });
  }

  public logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  public getCurrentUser(): Omit<AppUser, 'passwordHash'> | null {
    const session = this.getSession();
    if (!session || !session.isActive || new Date(session.expiresAt).getTime() <= Date.now()) {
      return null;
    }

    const user = this.getUsers().find((entry) => entry.userId === session.userId);
    if (!user) {
      return null;
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  private seedUsersIfMissing(): void {
    const usersRaw = localStorage.getItem(USERS_KEY);
    if (usersRaw) {
      return;
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
  }

  private getUsers(): AppUser[] {
    const usersRaw = localStorage.getItem(USERS_KEY);
    if (!usersRaw) {
      return [];
    }

    try {
      return JSON.parse(usersRaw) as AppUser[];
    } catch {
      return [];
    }
  }

  private getSession(): Session | null {
    const sessionRaw = localStorage.getItem(SESSION_KEY);
    if (!sessionRaw) {
      return null;
    }

    try {
      return JSON.parse(sessionRaw) as Session;
    } catch {
      return null;
    }
  }

  private getVerificationTokens(): Record<string, string> {
    const raw = localStorage.getItem(VERIFICATION_KEY);
    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {};
    }
  }
}