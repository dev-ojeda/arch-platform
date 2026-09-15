import { describe, expect, it } from 'vitest';

import type { SecurityState } from '@arch-platform/compliance';

import { securityStateFixture } from '../fixture/create-security-state.fixture.js';

describe('SecurityState', () => {
  it('should represent an evaluated artifact', () => {
    const state: SecurityState = {
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/core': {
          previousStatus: undefined,
          evaluation: {
            status: 'secure',
            artifactHash: 'abc123',
            evaluatedAt: '2026-09-07T20:00:00.000Z',
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
      },
    };

    const artifact = state.artifacts['@arch-platform/core'];

    expect(state.schemaVersion).toBe(1);
    expect(artifact).toBeDefined();
    expect(artifact?.evaluation.status).toBe('secure');
    expect(artifact?.decision.status).toBe('allowed');
    expect(artifact?.evaluation.artifactHash).toBe('abc123');
    expect(artifact?.decision.artifactHash).toBe('abc123');
  });

  it('should preserve the relationship between evaluation and decision', () => {
    const state: SecurityState = {
      schemaVersion: 1,
      artifacts: {
        '@arch-platform/core': {
          previousStatus: undefined,
          evaluation: {
            status: 'blocked',
            artifactHash: 'abc123',
            evaluatedAt: '2026-09-07T20:00:00.000Z',
            findings: [],
          },
          decision: {
            status: 'blocked',
            artifactHash: 'abc123',
            policyId: 'default',
            policyVersion: '1',
            reasons: ['Security evaluation is blocked'],
          },
        },
      },
    };

    const artifact = state.artifacts['@arch-platform/core'];

    expect(artifact?.evaluation.artifactHash).toBe(artifact?.decision.artifactHash);
  });

  it('represents multiple artifacts', () => {
    expect(Object.keys(securityStateFixture.artifacts)).toHaveLength(2);

    expect(securityStateFixture.artifacts['@arch-platform/contracts']).toBeDefined();

    expect(securityStateFixture.artifacts['@arch-platform/core']).toBeDefined();
  });
});
