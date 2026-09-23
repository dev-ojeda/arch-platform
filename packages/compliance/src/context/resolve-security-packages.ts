// packages/compliance/src/context/resolve-security-packages.ts

import type {
  PackageDescriptor,
  SecurityScope,
  WorkspaceDescriptor,
} from '@arch-platform/platform-model';

export function resolveSecurityPackages(
  workspace: WorkspaceDescriptor,
  scope: SecurityScope,
): readonly PackageDescriptor[] {
  switch (scope.kind) {
    case 'package':
      return resolvePackage(workspace, scope.packageName);

    case 'workspace':
      return workspace.packages;
  }
}

function resolvePackage(
  workspace: WorkspaceDescriptor,
  packageName: string,
): readonly PackageDescriptor[] {
  return workspace.packages.filter((pkg) => pkg.name === packageName);
}
