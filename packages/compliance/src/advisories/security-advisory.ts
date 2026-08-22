// packages/compliance/src/advisories/security-advisory.ts

import { AdvisoryIdentifier } from './advisory-identifier.js';
import type { SecurityAssessment } from './security-assessment.js';

export interface SecurityAdvisory {
  readonly identifiers: readonly AdvisoryIdentifier[];
  readonly assessments: readonly SecurityAssessment[];
}
