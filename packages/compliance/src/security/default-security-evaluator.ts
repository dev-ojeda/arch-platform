// packages/compliance/src/security/default-security-evaluator.ts

import type { SecurityAdvisory } from '../advisories/security-advisory.js';
import type { SecurityAdvisoryProvider } from '../ports/security-advisory-provider.js';
import { DependencyGraphService } from '../services/dependency-graph-service.js';

import type { SecurityEvaluation } from './security-evaluation.js';
import type { SecurityFinding } from './security-finding.js';
import type { SecuritySeverity } from './security-severity.js';

export class DefaultSecurityEvaluator {
  constructor(
    private readonly dependencyGraph: DependencyGraphService,
    private readonly advisoryProvider: SecurityAdvisoryProvider,
  ) {}

  async evaluate(artifactId: string, artifactHash: string): Promise<SecurityEvaluation> {
    const closure = this.dependencyGraph.getDependencyClosure(artifactId);
    const findings: SecurityFinding[] = [];

    for (const dependencyId of closure) {
      const dependency = this.dependencyGraph.getNode(dependencyId);

      const advisories = await this.advisoryProvider.getAdvisories(
        dependency.packageName,
        dependency.version,
      );
      for (const advisory of advisories) {
        const advisoryIdentifier =
          advisory.identifiers?.find((identifier) => identifier.namespace === 'CVE') ??
          advisory.identifiers?.[0];

        if (!advisoryIdentifier) {
          continue;
        }
        findings.push({
          id: `${advisoryIdentifier.namespace}:${advisoryIdentifier.value}:${dependency.id}`,
          advisory: advisoryIdentifier,
          severity: this.resolveSeverity(advisory),
          category: 'vulnerability',
          message:
            `Security advisory ${advisoryIdentifier.namespace}:${advisoryIdentifier.value} ` +
            `affects ${dependency.packageName}@${dependency.version}`,
          blocking: true,
        });
      }
    }

    return {
      status: findings.length > 0 ? 'blocked' : 'secure',
      artifactHash,
      evaluatedAt: new Date().toISOString(),
      findings,
    };
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
