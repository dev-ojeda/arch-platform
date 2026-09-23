// packages/platform-model/src/security/security-advisory-affected-port.ts

import type { SecurityAdvisoryAffectedRecord } from './security-advisory-affected-record.js';
import type { SecurityAdvisoryAffected } from './security-advisory-affected.js';

export interface SecurityAdvisoryAffectedPort {
  advisoryAffected(affected: SecurityAdvisoryAffectedRecord): SecurityAdvisoryAffected;
}
