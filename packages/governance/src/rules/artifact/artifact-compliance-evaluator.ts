// packages/governance/src/rules/artifact/artifact-compliance-evaluator.ts

import type {
  ComplianceEnvironment,
  ComplianceStateChange,
  Diagnostic,
} from '@arch/platform-model';

import type { ComplianceDependencyContext } from '../../compliance/compliance-dependencies-context.js';
import type { ComplianceEvaluated } from '../../compliance/compliance-evaluated.js';
import type { ComplianceRuleEvaluation } from '../../compliance/compliance-rule-evaluation.js';
import type { ComplianceArtifactContext } from '../../context/compliance-artifact-context.js';
import type { ComplianceExecutionContext } from '../../context/compliance-execution-context.js';
import { dependencyNotCompliant } from '../../diagnostics/artifact-compliance-diagnostics.js';

export class ArtifactComplianceEvaluator implements ComplianceEvaluated {
  evaluate(context: ComplianceExecutionContext): ComplianceRuleEvaluation {
    return this.verifyArtifactComplianceStatus(context.artifacts, context.environment);
  }
  private verifyArtifactComplianceStatus(
    artifacts: readonly ComplianceArtifactContext[],
    environment: ComplianceEnvironment | undefined,
  ): ComplianceRuleEvaluation {
    const diagnostics: Diagnostic[] = [];
    const changes: ComplianceStateChange[] = [];

    if (!environment) {
      throw new Error('Compliance environment is required.');
    }

    for (const artifact of artifacts) {
      if (!artifact.artifactStatus) {
        continue;
      }

      if (!artifact.artifactHash) {
        continue;
      }

      const dependency = this.findNonCompliantDependency(artifact);

      if (dependency) {
        diagnostics.push(dependencyNotCompliant(artifact, dependency));

        if (artifact.complianceStatus !== 'transition') {
          changes.push({
            environment,
            artifact: artifact.artifact.name,
            previousStatus: artifact.complianceStatus,
            nextStatus: 'transition',
            evaluatedHash: artifact.artifactHash,
          });
        }

        continue;
      }

      if (artifact.complianceStatus === undefined) {
        changes.push({
          environment,
          artifact: artifact.artifact.name,
          previousStatus: undefined,
          nextStatus: 'transition',
          evaluatedHash: artifact.artifactHash,
        });

        continue;
      }

      const artifactHash = artifact.artifactHash.hash;
      const evaluatedHash = artifact.complianceEvaluatedHash?.hash;
      const approvedHash = artifact.complianceApprovedHash?.hash;

      if (artifact.complianceStatus === 'transition') {
        if (evaluatedHash === artifactHash) {
          changes.push({
            environment,
            artifact: artifact.artifact.name,
            previousStatus: 'transition',
            nextStatus: 'approved',
            evaluatedHash: artifact.artifactHash,
          });

          continue;
        }

        changes.push({
          environment,
          artifact: artifact.artifact.name,
          previousStatus: 'transition',
          nextStatus: 'transition',
          evaluatedHash: artifact.artifactHash,
        });

        continue;
      }

      if (approvedHash !== artifactHash) {
        changes.push({
          environment,
          artifact: artifact.artifact.name,
          previousStatus: artifact.complianceStatus,
          nextStatus: 'transition',
          evaluatedHash: artifact.artifactHash,
        });

        continue;
      }
    }

    return {
      diagnostics,
      changes,
    };
  }

  private isDependencyCompliant(dependency: ComplianceDependencyContext): boolean {
    if (dependency.artifactStatus !== 'built' && dependency.artifactStatus !== 'cached') {
      return false;
    }

    if (dependency.complianceStatus !== 'approved') {
      return false;
    }

    if (!dependency.artifactHash) {
      return false;
    }

    if (!dependency.complianceApprovedHash) {
      return false;
    }

    return dependency.artifactHash.hash === dependency.complianceApprovedHash.hash;
  }

  private findNonCompliantDependency(
    artifact: ComplianceArtifactContext,
  ): ComplianceDependencyContext | undefined {
    return artifact.dependencies.find((dependency) => !this.isDependencyCompliant(dependency));
  }
}
