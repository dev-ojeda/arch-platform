// packages/compliance/src/context/build-compliance-security-context.ts

import type {
  DependencyLockfile,
  SecurityAdvisory,
  SecurityComplianceArtifactReader,
  SecurityContext,
  SecurityStateReader,
  WorkspaceDescriptor,
} from '@arch-platform/platform-model';

import type { SecurityOptions } from '../security/security-options.js';

import { resolveComplianceSecurityScope } from './resolve-compliance-security-scope.js';
import { resolveSecurityPackages } from './resolve-security-packages.js';

export async function buildComplianceSecurityContext(
  options: SecurityOptions,
  workspace: WorkspaceDescriptor,
  securityStatesReader: SecurityStateReader,
  securityComplianceArtifactReader: SecurityComplianceArtifactReader,
  dependencyLockfile: DependencyLockfile,
  securityAdvisories: readonly SecurityAdvisory[],
): Promise<SecurityContext> {
  const scope = resolveComplianceSecurityScope(options);
  const packages = resolveSecurityPackages(workspace, scope);
  if (!options.environment) {
    throw new Error('Security environment is required.');
  }

  const securityStates = await securityStatesReader.read(scope.root);

  const securityComplianceArtifact = await securityComplianceArtifactReader.read(
    scope.root,
    options.packageName,
  );

  return {
    workspace,
    scope,
    packages,
    securityStates,
    securityComplianceArtifact,
    environment: options.environment,
    dependencyLockfile,
    securityAdvisories,
  };
}
