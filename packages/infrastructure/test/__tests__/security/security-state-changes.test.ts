import { describe, expect, it } from 'vitest';

import type { SecurityStateChange } from '@arch-platform/platform-model';

import { MutableSecurityStateChanges } from '../../../src/security/security-state-changes.js';

describe('MutableSecurityStateChanges', () => {
  it('starts empty', () => {
    const changes = new MutableSecurityStateChanges();

    expect(changes.isEmpty).toBe(true);
    expect(changes.toSnapshot()).toEqual({
      changes: [],
    });
  });

  it('accumulates changes and returns a snapshot', () => {
    const changes = new MutableSecurityStateChanges();

    const change: SecurityStateChange = {
      artifact: '@arch-platform/core',

      previousStatus: undefined,

      evaluation: {
        status: 'secure',
        artifactHash: 'hash-core',
        evaluatedAt: '2026-09-07T21:00:00.000Z',
        findings: [],
        summary: undefined,
      },

      decision: {
        status: 'allowed',
        artifactHash: 'hash-core',
        policyId: 'default',
        policyVersion: '1',
        reasons: [],
      },
    };

    changes.add(change);

    expect(changes.isEmpty).toBe(false);

    expect(changes.toSnapshot()).toEqual({
      changes: [change],
    });
  });

  it('does not expose the internal changes array', () => {
    const changes = new MutableSecurityStateChanges();

    const change: SecurityStateChange = {
      artifact: '@arch-platform/core',

      previousStatus: undefined,

      evaluation: {
        status: 'secure',
        artifactHash: 'hash-core',
        evaluatedAt: '2026-09-07T21:00:00.000Z',
        findings: [],
        summary: undefined,
      },

      decision: {
        status: 'allowed',
        artifactHash: 'hash-core',
        policyId: 'default',
        policyVersion: '1',
        reasons: [],
      },
    };

    changes.add(change);

    const firstSnapshot = changes.toSnapshot();
    const secondSnapshot = changes.toSnapshot();

    expect(firstSnapshot.changes).not.toBe(secondSnapshot.changes);
  });

  it('keeps evaluation and decision bound to the same artifact hash', () => {
    const changes = new MutableSecurityStateChanges();

    const change: SecurityStateChange = {
      artifact: '@arch-platform/core',
      previousStatus: undefined,

      evaluation: {
        status: 'secure' as const,
        artifactHash: 'hash-core',
        evaluatedAt: '2026-09-07T21:00:00.000Z',
        findings: [],
        summary: undefined,
      },

      decision: {
        status: 'allowed' as const,
        artifactHash: 'hash-core',
        policyId: 'default',
        policyVersion: '1',
        reasons: [],
      },
    };

    changes.add(change);

    const snapshot = changes.toSnapshot();

    expect(snapshot.changes[0].evaluation.artifactHash).toBe(
      snapshot.changes[0].decision.artifactHash,
    );
  });
});
