// packages/governance/src/context/resolve-compliance-packages.ts

import type { PackageDescriptor, WorkspaceDescriptor } from '@arch/platform-model';

import type { ComplianceScope } from '../public/compliance-scope.js';

export function resolveCompliancePackages(
  workspace: WorkspaceDescriptor,
  scope: ComplianceScope,
): readonly PackageDescriptor[] {
  switch (scope.kind) {
    case 'package':
      return resolvePackageDependencies(workspace, scope.packageName);

    case 'workspace':
      return workspace.packages;
  }
}

function resolvePackageDependencies(
  workspace: WorkspaceDescriptor,
  packageName: string,
): readonly PackageDescriptor[] {
  const packagesByName = new Map(workspace.packages.map((pkg) => [pkg.name, pkg]));

  const resolved = new Map<string, PackageDescriptor>();
  const pending = [packageName];

  while (pending.length > 0) {
    const current = pending.pop();

    if (!current || resolved.has(current)) {
      continue;
    }

    const pkg = packagesByName.get(current);

    if (!pkg) {
      continue;
    }

    resolved.set(pkg.name, pkg);

    for (const dependency of pkg.internalDependencies) {
      if (!resolved.has(dependency)) {
        pending.push(dependency);
      }
    }
  }
  return [...resolved.values()];
}
