// packages/compliance/src/security/default-security-policy.ts

import type { SecurityDecision } from './security-decision.js';
import type { SecurityEvaluation } from './security-evaluation.js';
import type { SecurityPolicy } from './security-policy.js';

export class DefaultSecurityPolicy implements SecurityPolicy {
  readonly id = 'default';
  readonly version = '1';

  evaluate(evaluation: SecurityEvaluation): SecurityDecision {
    switch (evaluation.status) {
      case 'secure':
        return {
          status: 'allowed',
          artifactHash: evaluation.artifactHash,
          policyId: this.id,
          policyVersion: this.version,
          reasons: [],
        };

      case 'review':
        return {
          status: 'review',
          artifactHash: evaluation.artifactHash,
          policyId: this.id,
          policyVersion: this.version,
          reasons: ['Security evaluation requires review'],
        };

      case 'blocked':
        return {
          status: 'blocked',
          artifactHash: evaluation.artifactHash,
          policyId: this.id,
          policyVersion: this.version,
          reasons: ['Security evaluation is blocked'],
        };

      case 'stale':
        return {
          status: 'blocked',
          artifactHash: evaluation.artifactHash,
          policyId: this.id,
          policyVersion: this.version,
          reasons: ['Security evaluation is stale'],
        };

      case 'not-evaluated':
        return {
          status: 'blocked',
          artifactHash: evaluation.artifactHash,
          policyId: this.id,
          policyVersion: this.version,
          reasons: ['Security evaluation has not been performed'],
        };
    }
  }
}
