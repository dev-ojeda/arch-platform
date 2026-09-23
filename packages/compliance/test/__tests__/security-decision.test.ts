import { describe, expect, it } from 'vitest';

import type { SecurityDecision } from '@arch-platform/compliance';

describe('SecurityDecision', () => {
  it('supports an allowed decision', () => {
    const decision: SecurityDecision = {
      status: 'allowed',
      artifactHash: 'sha256:a',
      policyId: 'default',
      policyVersion: '1',
      reasons: [],
    };

    expect(decision.status).toBe('allowed');
    expect(decision.artifactHash).toBe('sha256:a');
    expect(decision.policyId).toBe('default');
    expect(decision.policyVersion).toBe('1');
    expect(decision.reasons).toEqual([]);
  });

  it('preserves artifact and policy identity', () => {
    const decision: SecurityDecision = {
      status: 'blocked',
      artifactHash: 'sha256:abc123',
      policyId: 'default',
      policyVersion: '1',
      reasons: ['Security evaluation is blocked'],
    };

    expect(decision.artifactHash).toBe('sha256:abc123');
    expect(decision.policyId).toBe('default');
    expect(decision.policyVersion).toBe('1');
    expect(decision.reasons).toEqual(['Security evaluation is blocked']);
  });
});
