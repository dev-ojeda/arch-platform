// packages/governance/src/rules/compliance/governance-compliance-evaluator.ts

// packages/governance/src/rules/artifact/artifact-state-evaluator.ts

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../../context/governance-context.js';

import type { GovernanceComplianceContext } from './governance-compliance-context.js';
import type { GovernanceComplianceEvaluated } from './governance-compliance-evaluated.js';
import type { GovernanceComplianceEvaluation } from './governance-compliance-evaluation.js';

export class GovernanceComplianceEvaluator implements GovernanceComplianceEvaluated {
  evaluate(context: GovernanceExecutionContext): GovernanceComplianceEvaluation {
    const artifacts = this.resolveArtifacts(context);

    return this.verifyArtifactComplianceStatus(artifacts);
  }

  private resolveArtifacts(
    context: GovernanceExecutionContext,
  ): readonly GovernanceComplianceContext[] {
    const artifacts: GovernanceComplianceContext[] = [];

    for (const pkg of context.packages.resolveScope(context.scope)) {
      const artifactState = context.artifactStates.get(pkg.name);
      const complianceState = context.complianceStates.artifacts[pkg.name];

      artifacts.push({
        artifact: pkg,
        artifactStatus: artifactState?.status,
        complianceStatus: complianceState?.status,
      });
    }

    return artifacts;
  }

  private verifyArtifactComplianceStatus(
    artifacts: readonly GovernanceComplianceContext[],
  ): GovernanceComplianceEvaluation {
    const diagnostics: Diagnostic[] = [];
    const changes: ComplianceStateChange[] = [];

    for (const artifact of artifacts) {
      if (!artifact.artifactStatus) {
        continue;
      }

      if (artifact.complianceStatus === 'transition') {
        continue;
      }

      if (artifact.complianceStatus === undefined) {
        changes.push({
          artifact: artifact.artifact.name,
          previous: undefined,
          current: 'transition',
        });
      }
    }
    return {
      diagnostics,
      changes,
    };
  }
}
