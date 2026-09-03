// packages/governance/src/context/build-compliance-execution-context.ts

import type { ComplianceContext } from './compliance-context.js';
import type { ComplianceExecutionContext } from './compliance-execution-context.js';
import { resolveCompliancePackages } from './resolve-compliance-packages.js';

export function buildComplianceExecutionContext(
  context: ComplianceContext,
): ComplianceExecutionContext {
  const packages = resolveCompliancePackages(context.workspace, context.scope);

  let targetPackages = packages;

  if (context.scope.kind === 'package') {
    const pkgName = context.scope.packageName;
    targetPackages = packages.filter((pkg) => pkg.name === pkgName);
  }

  const environmentState = context.complianceStates.environment;
  const artifacts = targetPackages.map((pkg) => {
    const artifactState = context.artifactStates.get(pkg.name);
    const compliance = environmentState.artifacts[pkg.name];

    const dependencies = (artifactState?.dependencies ?? []).map((dependency) => {
      const dependencyPackage = context.workspace.packages.find(
        (candidate) => candidate.name === dependency,
      );

      const dependencyState = context.artifactStates.get(dependency);
      const dependencyCompliance = environmentState.artifacts[dependency];

      return {
        artifact: dependency,
        artifactKind: dependencyPackage?.manifest.arch?.kind,
        artifactType: dependencyState?.artifactType,
        artifactStatus: dependencyState?.status,
        artifactHash: dependencyState?.hash,

        complianceStatus: dependencyCompliance?.status,
        complianceEvaluatedHash: dependencyCompliance?.evaluatedHash,
        complianceApprovedHash: dependencyCompliance?.approvedHash,
      };
    });

    return {
      artifact: pkg,
      artifactKind: pkg.manifest.arch.kind,
      artifactType: artifactState?.artifactType,
      artifactStatus: artifactState?.status,
      artifactHash: artifactState?.hash,

      complianceStatus: compliance?.status,
      complianceEvaluatedHash: compliance?.evaluatedHash,
      complianceApprovedHash: compliance?.approvedHash,

      environment: environmentState.name,

      dependencies,
    };
  });

  return {
    ...context,
    artifacts,
  };
}
