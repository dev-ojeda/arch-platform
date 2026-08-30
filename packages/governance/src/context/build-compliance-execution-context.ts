// packages/governance/src/context/build-compliance-execution-context.ts

import type { ComplianceContext } from './compliance-context.js';
import type { ComplianceExecutionContext } from './compliance-execution-context.js';
import { resolveCompliancePackages } from './resolve-compliance-packages.js';

export function buildComplianceExecutionContext(
  context: ComplianceContext,
): ComplianceExecutionContext {
  const packages = resolveCompliancePackages(context.workspace, context.scope);
  const artifacts = packages.map((pkg) => {
    const artifactState = context.artifactStates.get(pkg.name);

    const dependencies = pkg.internalDependencies.map((dependency) => {
      const dependencyPackage = context.workspace.packages.find(
        (candidate) => candidate.name === dependency,
      );

      const dependencyState = context.artifactStates.get(dependency);

      return {
        artifact: dependency,
        artifactKind: dependencyPackage?.manifest.arch?.kind,
        artifactType: dependencyState?.artifactType,
        artifactStatus: dependencyState?.status,
        complianceStatus: context.complianceStates.artifacts[dependency]?.status,
      };
    });

    return {
      artifact: pkg,
      artifactKind: pkg.manifest.arch.kind,
      artifactType: artifactState?.artifactType,
      artifactStatus: artifactState?.status,
      artifactHash: artifactState?.hash,
      complianceStatus: context.complianceStates.artifacts[pkg.name]?.status,
      complianceHash: context.complianceStates.artifacts[pkg.name]?.hash,
      dependencies,
    };
  });

  return {
    ...context,
    artifacts,
  };
}
