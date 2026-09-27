// packages\compliance\test\__tests__\default-security-evaluator.test.ts
import { describe, expect, it } from 'vitest';

import { DefaultSecurityEvaluator, SecurityVulnerabilityMatcher } from '@arch-platform/compliance';

import { securityAdvisoryFixtures } from '../fixture/create-security-advisory.js';
import { createSecurityExecutionContext } from '../fixture/create-security-execution-context.js';

describe('DefaultSecurityEvaluator', () => {
  const evaluator = new DefaultSecurityEvaluator(new SecurityVulnerabilityMatcher());

  it('evaluates security findings only for dependencies in the artifact closure', async () => {
    const context = createSecurityExecutionContext();

    const result = await evaluator.evaluate(context);
    const evaluation = result.changes[0].evaluation;

    expect(evaluation.status).toBe('blocked');
    expect(evaluation.artifactHash).toBe('sha256:H1');

    expect(evaluation.findings).toHaveLength(3);
    expect(evaluation.findings.map((finding) => finding.severity)).toEqual([
      'high',
      'high',
      'high',
    ]);
    expect(evaluation.findings.map((finding) => finding.advisory?.value)).toEqual([
      'CVE-2026-13149',
      'CVE-2026-14257',
      'CVE-2026-69152',
    ]);
  });

  it('uses the advisory severity when creating findings', async () => {
    const advisory = {
      ...securityAdvisoryFixtures[0],
      assessments: [
        {
          version: '4.0',
          baseScore: 9.8,
          baseSeverity: 'CRITICAL',
          vectorString: 'test',
        },
      ],
    };

    const context = createSecurityExecutionContext({
      advisories: [advisory],
    });

    const result = await evaluator.evaluate(context);
    const evaluation = result.changes[0].evaluation;

    expect(
      evaluation.findings.find((finding) => finding.advisory?.value === 'CVE-2026-13149')?.severity,
    ).toBe('critical');
  });
});
