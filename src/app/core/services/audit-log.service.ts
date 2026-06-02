import { Injectable } from '@angular/core';

import { AuditEventType, AuditLogEntry } from '../models/audit.models';

const AUDIT_LOG_KEY = 'expense-tracker.audit-logs';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  public appendLog(input: {
    eventType: AuditEventType;
    actorUserId: string;
    actorRole: string;
    entityType: string;
    entityId: string;
    action: string;
    metadata: string;
  }): AuditLogEntry {
    const log: AuditLogEntry = {
      auditLogId: `audit-${crypto.randomUUID()}`,
      correlationId: crypto.randomUUID(),
      eventTimestamp: new Date().toISOString(),
      ...input
    };

    const logs = this.getLogs();
    logs.push(log);
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));

    return log;
  }

  public getLogs(): AuditLogEntry[] {
    const logsRaw = localStorage.getItem(AUDIT_LOG_KEY);
    if (!logsRaw) {
      return [];
    }

    try {
      return JSON.parse(logsRaw) as AuditLogEntry[];
    } catch {
      return [];
    }
  }
}