export type UserRole = 'User' | 'Manager' | 'Admin';

export interface AppUser {
  userId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isEmailVerified: boolean;
  status: 'Active' | 'Suspended';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Session {
  sessionId: string;
  userId: string;
  accessToken: string;
  issuedAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface AuthResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string;
  user: Omit<AppUser, 'passwordHash'>;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResult {
  userId: string;
  verificationStatus: 'Pending' | 'Verified';
  createdAt: string;
  verificationToken: string;
}