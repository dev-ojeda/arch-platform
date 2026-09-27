import type { SecurityState } from '@arch-platform/platform-model';

export const securityStateFixture: SecurityState = {
  schemaVersion: 1,

  artifacts: {
    '@arch-platform/contracts': {
      previousStatus: 'allowed',
      evaluation: {
        status: 'secure',
        artifactHash: 'hash-contracts',
        evaluatedAt: '2026-09-07T21:00:00.000Z',
        findings: [],
        summary: undefined,
      },

      decision: {
        status: 'allowed',
        artifactHash: 'hash-contracts',
        policyId: 'default',
        policyVersion: '1',
        reasons: [],
      },
    },

    '@arch-platform/core': {
      previousStatus: 'review',
      evaluation: {
        status: 'review',
        artifactHash: 'hash-core',
        evaluatedAt: '2026-09-07T21:01:00.000Z',
        findings: [
          {
            id: 'SEC-CORE-001',
            advisory: {
              namespace: 'CVE',
              value: 'CVE-2026-1234',
            },
            severity: 'high',
            category: 'vulnerability',
            message: 'Vulnerable dependency detected',
            blocking: true,
          },
        ],
        summary: undefined,
      },

      decision: {
        status: 'review',
        artifactHash: 'hash-core',
        policyId: 'default',
        policyVersion: '1',
        reasons: ['Security evaluation requires review'],
      },
    },
  },
};
