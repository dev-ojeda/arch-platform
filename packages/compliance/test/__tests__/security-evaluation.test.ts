// packages\compliance\test\__tests__\security-evaluation.test.ts

import { describe, expect, it } from 'vitest';

import type { SecurityEvaluation, SecurityFinding } from '@arch-platform/compliance';

describe('SecurityEvaluation', () => {
  it('associates the evaluation with an exact artifact hash', () => {
    const finding: SecurityFinding = {
      id: 'CVE-2026-0001',
      severity: 'high',
      category: 'vulnerability',
      message: 'High vulnerability detected',
      blocking: true,
    };

    const evaluation: SecurityEvaluation = {
      status: 'blocked',
      artifactHash: 'sha256:abc123',
      evaluatedAt: '2026-09-06T23:00:00.000Z',
      findings: [finding],
    };

    expect(evaluation.artifactHash).toBe('sha256:abc123');
    expect(evaluation.status).toBe('blocked');
    expect(evaluation.findings).toHaveLength(1);
  });

  it('supports a secure evaluation without findings', () => {
    const evaluation: SecurityEvaluation = {
      status: 'secure',
      artifactHash: 'sha256:abc123',
      evaluatedAt: '2026-09-06T23:00:00.000Z',
      findings: [],
    };

    expect(evaluation.status).toBe('secure');
    expect(evaluation.findings).toEqual([]);
  });

  it('supports a stale evaluation', () => {
    const evaluation: SecurityEvaluation = {
      status: 'stale',
      artifactHash: 'sha256:old',
      evaluatedAt: '2026-09-06T22:00:00.000Z',
      findings: [],
    };

    expect(evaluation.status).toBe('stale');
    expect(evaluation.artifactHash).toBe('sha256:old');
  });
});
