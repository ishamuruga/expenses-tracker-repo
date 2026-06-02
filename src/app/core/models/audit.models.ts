export type AuditEventType =
  | 'Authentication'
  | 'Authorization'
  | 'BusinessAction'
  | 'Operational'
  | 'Security';

export interface AuditLogEntry {
  auditLogId: string;
  eventType: AuditEventType;
  actorUserId: string;
  actorRole: string;
  entityType: string;
  entityId: string;
  action: string;
  correlationId: string;
  eventTimestamp: string;
  metadata: string;
}