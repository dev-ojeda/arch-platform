// packages/compliance/src/context/build-compliance-security-execution-context.ts

import type {
  DependencyGraph,
  SecurityContext,
  SecurityExecutionContext,
} from '@arch-platform/platform-model';

export function buildComplianceSecurityExecutionContext(
  context: SecurityContext,
  dependencyGraph: DependencyGraph,
): SecurityExecutionContext {
  const packages = context.packages;

  let targetPackages = packages;

  if (context.scope.kind === 'package') {
    const packageName = context.scope.packageName;

    targetPackages = packages.filter((pkg) => pkg.name === packageName);
  }

  const pkg = targetPackages[0];

  if (!pkg) {
    throw new Error('Security package not found.');
  }

  const previousSecurityStatus = context.securityStates.artifacts[pkg.name]?.decision.status;

  return {
    packageName: pkg.name,
    artifactHash: context.securityComplianceArtifact.hash,
    complianceStatus: context.securityComplianceArtifact.status,
    previousSecurityStatus,
    dependencyGraph,
    advisories: context.securityAdvisories,
  };
}
