import { describe, expect, it } from 'vitest';

import type { SecurityStateChanges } from '@arch-platform/compliance';

describe('SecurityStateChanges', () => {
  it('should contain security state changes', () => {
    const changes: SecurityStateChanges = {
      changes: [
        {
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
        },
      ],
    };

    expect(changes.changes).toHaveLength(1);
    expect(changes.changes[0]?.artifact).toBe('@arch-platform/core');
    expect(changes.changes[0]?.previousStatus).toBe('allowed');
    expect(changes.changes[0]?.evaluation.status).toBe('secure');
    expect(changes.changes[0]?.decision.status).toBe('allowed');
  });
});
