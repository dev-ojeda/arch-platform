// packages/compliance/src/advisories/security-advisory.ts

import { AdvisoryIdentifier } from './advisory-identifier.js';
import type { SecurityAdvisoryAffected } from './security-advisory-affected.js';
import type { SecurityAssessment } from './security-assessment.js';

export interface SecurityAdvisory {
  readonly identifiers?: readonly AdvisoryIdentifier[];
  readonly cweIds: readonly `CWE-${string}`[];
  readonly assessments?: readonly SecurityAssessment[];
  readonly affected: readonly SecurityAdvisoryAffected[];
}
