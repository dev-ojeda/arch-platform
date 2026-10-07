// packages/platform-model/src/publication/publication-eligibility.ts

import type { PublicationBlockReason } from './publication-block-reason.js';
import type { PublicationEligibilityStatus } from './publication-eligibility-status.js';

export interface PublicationEligibility {
  readonly status: PublicationEligibilityStatus;
  readonly reasons: readonly PublicationBlockReason[];
}
