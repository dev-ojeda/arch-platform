import { describe, expect, it } from 'vitest';

import type { SecurityStateChange } from '@arch-platform/compliance';

describe('SecurityStateChange', () => {
  it('should represent a security status transition', () => {
    const change: SecurityStateChange = {
      artifact: '@arch-platform/core',
      previousStatus: 'allowed',

      evaluation: {
        status: 'secure',
        artifactHash: 'abc123',
        evaluatedAt: '2026-09-07T21:00:00.000Z',
        findings: [],
      },

      decision: {
        status: 'allowed',
        artifactHash: 'abc123',
        policyId: 'default',
        policyVersion: '1',
        reasons: [],
      },
    };

    expect(change.artifact).toBe('@arch-platform/core');
    expect(change.previousStatus).toBe('allowed');

    expect(change.evaluation.status).toBe('secure');
    expect(change.evaluation.artifactHash).toBe('abc123');

    expect(change.decision.status).toBe('allowed');
    expect(change.decision.artifactHash).toBe('abc123');
    expect(change.decision.policyId).toBe('default');
    expect(change.decision.policyVersion).toBe('1');
  });

  it('should represent a transition from an existing decision', () => {
    const change: SecurityStateChange = {
      artifact: '@arch-platform/core',
      previousStatus: 'review',

      evaluation: {
        status: 'review',
        artifactHash: 'def456',
        evaluatedAt: '2026-09-07T21:01:00.000Z',
        findings: [],
      },

      decision: {
        status: 'review',
        artifactHash: 'def456',
        policyId: 'default',
        policyVersion: '2',
        reasons: ['Security evaluation requires review'],
      },
    };

    expect(change.previousStatus).toBe('review');
    expect(change.evaluation.status).toBe('review');
    expect(change.evaluation.artifactHash).toBe('def456');
    expect(change.decision.status).toBe('review');
    expect(change.decision.policyVersion).toBe('2');
  });
});
