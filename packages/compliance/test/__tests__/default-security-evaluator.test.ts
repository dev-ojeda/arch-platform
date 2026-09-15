// packages\compliance\test\__tests__\default-security-evaluator.test.ts
import { describe, expect, it } from 'vitest';

import {
  DefaultSecurityAdvisoryProvider,
  DefaultSecurityEvaluator,
  DependencyGraphService,
  SecurityVulnerabilityMatcher,
} from '@arch-platform/compliance';

import { dependencyGraphFixture } from '../fixture/create-dependency-graph.js';
import { securityAdvisoryFixtures } from '../fixture/create-security-advisory.js';

describe('DefaultSecurityEvaluator', () => {
  const graphService = new DependencyGraphService(dependencyGraphFixture);

  it('evaluates security findings only for dependencies in the artifact closure', async () => {
    const provider = new DefaultSecurityAdvisoryProvider(
      securityAdvisoryFixtures,
      new SecurityVulnerabilityMatcher(),
    );

    const evaluator = new DefaultSecurityEvaluator(graphService, provider);

    const evaluation = await evaluator.evaluate('@arch-platform/code-analysis', 'sha256:H1');
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

    const provider = new DefaultSecurityAdvisoryProvider(
      [advisory],
      new SecurityVulnerabilityMatcher(),
    );

    const evaluator = new DefaultSecurityEvaluator(graphService, provider);

    const evaluation = await evaluator.evaluate('@arch-platform/code-analysis', 'sha256:H1');

    expect(
      evaluation.findings.find((finding) => finding.advisory?.value === 'CVE-2026-13149')?.severity,
    ).toBe('critical');
  });
});
