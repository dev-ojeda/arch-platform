// packages/governance/src/rules/artifact/artifact-compliance-evaluator.ts

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

import type { ComplianceDependencyContext } from '../../compliance/compliance-dependencies-context.js';
import type { ComplianceEvaluated } from '../../compliance/compliance-evaluated.js';
import type { ComplianceEvaluation } from '../../compliance/compliance-evaluation.js';
import type { ComplianceArtifactContext } from '../../context/compliance-artifact-context.js';
import type { ComplianceExecutionContext } from '../../context/compliance-execution-context.js';

export class ArtifactComplianceEvaluator implements ComplianceEvaluated {
  evaluate(context: ComplianceExecutionContext): ComplianceEvaluation {
    return this.verifyArtifactComplianceStatus(context.artifacts);
  }

  private verifyArtifactComplianceStatus(
    artifacts: readonly ComplianceArtifactContext[],
  ): ComplianceEvaluation {
    const diagnostics: Diagnostic[] = [];
    const changes: ComplianceStateChange[] = [];

    for (const artifact of artifacts) {
      if (!artifact.artifactStatus) {
        continue;
      }

      if (!artifact.artifactHash) {
        continue;
      }

      if (artifact.complianceStatus === undefined) {
        changes.push({
          artifact: artifact.artifact.name,
          previous: undefined,
          current: 'transition',
          hash: artifact.artifactHash,
        });

        continue;
      }

      if (!artifact.complianceHash) {
        changes.push({
          artifact: artifact.artifact.name,
          previous: artifact.complianceStatus,
          current: 'transition',
          hash: artifact.artifactHash,
        });

        continue;
      }

      const artifactHash = artifact.artifactHash.hash;
      const complianceHash = artifact.complianceHash.hash;

      if (artifactHash !== complianceHash) {
        if (artifact.complianceStatus !== 'transition') {
          changes.push({
            artifact: artifact.artifact.name,
            previous: artifact.complianceStatus,
            current: 'transition',
            hash: artifact.artifactHash,
          });
        }

        continue;
      }

      if (!this.areDependenciesCompliant(artifact)) {
        if (artifact.complianceStatus !== 'transition') {
          changes.push({
            artifact: artifact.artifact.name,
            previous: artifact.complianceStatus,
            current: 'transition',
            hash: artifact.artifactHash,
          });
        }

        continue;
      }

      if (artifact.complianceStatus === 'transition') {
        changes.push({
          artifact: artifact.artifact.name,
          previous: 'transition',
          current: 'approved',
          hash: artifact.artifactHash,
        });
      }
    }
    return {
      diagnostics,
      changes,
      executions: 0,
    };
  }

  private areDependenciesCompliant(artifact: ComplianceArtifactContext): boolean {
    return artifact.dependencies.every((dependency) =>
      this.isDependencyCompliant(artifact, dependency),
    );
  }

  private isDependencyCompliant(
    artifact: ComplianceArtifactContext,
    dependency: ComplianceDependencyContext,
  ): boolean {
    if (dependency.artifactStatus !== 'built' && dependency.artifactStatus !== 'cached') {
      return false;
    }

    if (dependency.complianceStatus !== 'approved') {
      return false;
    }

    return true;
  }
}
