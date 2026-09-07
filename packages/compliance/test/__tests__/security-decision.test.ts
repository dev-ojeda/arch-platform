import { describe, expect, it } from 'vitest';

import {
  DefaultSecurityPolicy,
  type SecurityDecision,
  type SecurityEvaluation,
} from '@arch-platform/compliance';

describe('SecurityDecision', () => {
  const policy = new DefaultSecurityPolicy();
  it('supports an allowed decision', () => {
    const decision: SecurityDecision = {
      status: 'allowed',
      artifactHash: 'a',
      policyId: 'default',
      policyVersion: '1',
      reasons: [],
    };

    expect(decision.status).toBe('allowed');
    expect(decision.artifactHash).toBe('a');
    expect(decision.policyId).toBe('default');
    expect(decision.policyVersion).toBe('1');
    expect(decision.reasons).toEqual([]);
  });
  it('preserves artifact and policy identity', () => {
    const evaluation: SecurityEvaluation = {
      status: 'secure',
      artifactHash: 'sha256:abc123',
      evaluatedAt: '2026-09-06T21:00:00.000Z',
      findings: [],
    };

    const decision = policy.evaluate(evaluation);

    expect(decision).toEqual({
      status: 'allowed',
      artifactHash: 'sha256:abc123',
      policyId: 'default',
      policyVersion: '1',
      reasons: [],
    });
  });
});
