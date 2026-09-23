// packages/compliance/src/public/resolved-security-action.ts

import type { SecurityStateChange } from '@arch-platform/platform-model';

import type { SecurityAction } from '../public/security-action.js';

export function resolveSecurityAction(change?: SecurityStateChange): SecurityAction {
  if (!change) {
    return 'none';
  }

  if (change.previousStatus === undefined) {
    return 'evaluate';
  }

  if (change.evaluation.status === 'review' || change.decision.status === 'review') {
    return 'review';
  }

  return 'none';
}
