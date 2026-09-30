import { db } from '../db.js';
import { AuditLog, AuditAction, UserRole } from '../../src/types/index.js';

export class AuditService {
  public static log(params: {
    user: string;
    role: UserRole;
    action: AuditAction;
    module: 'CORE' | 'MILESTONE_1_KYC_RBAC' | 'MILESTONE_2_DISBURSEMENT_NPA' | 'MILESTONE_3_SAGA_SETTLEMENT';
    entity: string;
    entityId: string;
    oldValue?: string;
    newValue?: string;
    ipAddress?: string;
    status?: 'SUCCESS' | 'FAILURE' | 'WARNING';
    details?: string;
  }): AuditLog {
    const state = db.getState();
    const id = `AUD-${String(state.auditLogs.length + 1).padStart(4, '0')}`;
    const newLog: AuditLog = {
      id,
      user: params.user || 'system',
      role: params.role || 'ADMIN',
      action: params.action,
      module: params.module,
      entity: params.entity,
      entityId: params.entityId,
      oldValue: params.oldValue,
      newValue: params.newValue,
      ipAddress: params.ipAddress || '192.168.1.1',
      timestamp: new Date().toISOString(),
      status: params.status || 'SUCCESS',
      details: params.details,
    };

    state.auditLogs.unshift(newLog);
    return newLog;
  }
}
