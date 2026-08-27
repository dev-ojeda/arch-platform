// packages/governance/src/context/default-governance-package-query.ts

import type { PackageDescriptor, WorkspaceDescriptor } from '@arch/platform-model';

import type { GovernanceScope } from '../public/governance-scope.js';

import type { PackageQuery } from './package-query.js';

export class DefaultGovernancePackageQuery implements PackageQuery {
  private readonly packagesByName: ReadonlyMap<string, PackageDescriptor>;

  constructor(workspace: WorkspaceDescriptor) {
    this.packagesByName = new Map(workspace.packages.map((pkg) => [pkg.name, pkg]));
  }

  get(name: string): PackageDescriptor | undefined {
    return this.packagesByName.get(name);
  }

  require(name: string): PackageDescriptor {
    const pkg = this.get(name);

    if (!pkg) {
      throw new Error(`Package "${name}" not found in workspace.`);
    }

    return pkg;
  }

  all(): readonly PackageDescriptor[] {
    return [...this.packagesByName.values()];
  }

  scoped(scope: GovernanceScope): readonly PackageDescriptor[] {
    if (scope.kind === 'package') {
      const pkg = this.get(scope.packageName);
      return pkg ? [pkg] : [];
    }

    return this.all();
  }
  resolveScope(scope: GovernanceScope): readonly PackageDescriptor[] {
    const packages = this.scoped(scope);
    const resolved = new Map<string, PackageDescriptor>();

    for (const pkg of packages) {
      resolved.set(pkg.name, pkg);

      for (const dependency of pkg.internalDependencies) {
        resolved.set(dependency, this.require(dependency));
      }
    }

    return [...resolved.values()];
  }
}
