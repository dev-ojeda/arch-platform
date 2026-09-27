// packages/compliance/src/security/default-security-evaluator.ts

import type {
  SecurityAdvisory,
  SecurityDecision,
  SecurityEvaluation,
  SecurityEvaluator,
  SecurityExecutionContext,
  SecurityFinding,
  SecuritySeverity,
  SecurityStateChange,
  SecurityStateChanges,
  SecurityVulnerabilitySummary,
} from '@arch-platform/platform-model';

import { SecurityVulnerabilityMatcher } from './security-vulnerability-matcher.js';

export class DefaultSecurityEvaluator implements SecurityEvaluator {
  constructor(private readonly vulnerabilityMatcher: SecurityVulnerabilityMatcher) {}

  evaluate(context: SecurityExecutionContext): Promise<SecurityStateChanges> {
    const findings: SecurityFinding[] = [];
    const vulnerabilities: SecurityVulnerabilitySummary[] = [];
    for (const dependency of context.dependencyGraph.nodes.values()) {
      for (const advisory of context.advisories) {
        const affected = advisory.affected?.find(
          (affected) => affected.packageName === dependency.packageName,
        );

        if (!affected) {
          continue;
        }

        const matchingVersion = this.vulnerabilityMatcher.findMatchingVersion(
          dependency.version,
          affected,
        );

        if (!matchingVersion) {
          continue;
        }
        const advisoryIdentifier =
          advisory.identifiers?.find((identifier) => identifier.namespace === 'CVE') ??
          advisory.identifiers?.[0];

        if (!advisoryIdentifier) {
          continue;
        }
        const finding: SecurityFinding = {
          id: `${advisoryIdentifier.namespace}:${advisoryIdentifier.value}:${dependency.id}`,
          advisory: advisoryIdentifier,
          evidence: {
            advisoryId: `${advisoryIdentifier.namespace}:${advisoryIdentifier.value}`,
            packageName: dependency.packageName,
            versionRange: matchingVersion.range,
          },
          severity: this.resolveSeverity(advisory),
          category: 'vulnerability',
          message:
            `Security advisory ${advisoryIdentifier.namespace}:${advisoryIdentifier.value} ` +
            `affects ${dependency.packageName}@${dependency.version}`,
          blocking: true,
        };

        findings.push(finding);

        vulnerabilities.push({
          advisoryId: `${advisoryIdentifier.namespace}:${advisoryIdentifier.value}`,
          packageName: dependency.packageName,
          version: dependency.version,
        });
      }
    }
    const evaluation: SecurityEvaluation = {
      status: findings.length > 0 ? 'blocked' : 'secure',
      artifactHash: context.artifactHash,
      evaluatedAt: new Date().toISOString(),
      summary: {
        totalFindings: findings.length,
        blockingFindings: findings.filter((finding) => finding.blocking).length,
        vulnerabilities,
      },
      findings,
    };

    const decision: SecurityDecision = {
      status: evaluation.status === 'blocked' ? 'blocked' : 'allowed',
      artifactHash: evaluation.artifactHash,
      policyId: 'default',
      policyVersion: '1',
      reasons: evaluation.status === 'blocked' ? ['Security evaluation is blocked'] : [],
    };

    const change: SecurityStateChange = {
      artifact: context.packageName,
      previousStatus: context.previousSecurityStatus,
      evaluation,
      decision,
    };

    return Promise.resolve({
      changes: [change],
    });
  }

  private resolveSeverity(advisory: SecurityAdvisory): SecuritySeverity {
    const severity = advisory.assessments
      ?.map((assessment) => assessment.baseSeverity?.toLowerCase())
      .find((severity) =>
        ['unknown', 'low', 'medium', 'high', 'critical'].includes(severity ?? ''),
      );

    return (severity as SecuritySeverity | undefined) ?? 'unknown';
  }
}
