// packages/infrastructure/src/workspace/node-package-provider.ts

import type { PackageDescriptor, PackageProvider } from '@arch/platform-model';

import { joinPath } from '../filesystem/io/path-utils.js';
import { PackageDescriptorFactory } from '../package/package-descriptor-factory.js';

import { findPackageRoots } from './find-package.js';
import { findWorkspaceRoot } from './find-workspace-root.js';

export class NodePackageProvider implements PackageProvider {
  private readonly descriptorFactory = new PackageDescriptorFactory();

  async discover(root: string): Promise<readonly PackageDescriptor[]> {
    const workspaceRoot = findWorkspaceRoot(root);

    const packageRoots = await findPackageRoots(joinPath(workspaceRoot, 'packages'));

    const packages = await Promise.all(
      packageRoots.map((packageRoot) => this.descriptorFactory.create(packageRoot)),
    );

    return this.resolveInternalDependencies(packages);
  }

  private resolveInternalDependencies(
    packages: readonly PackageDescriptor[],
  ): readonly PackageDescriptor[] {
    const packageNames = new Set(packages.map((pkg) => pkg.name));

    return packages.map((pkg) => ({
      ...pkg,
      internalDependencies: Object.keys(pkg.manifest.dependencies ?? {})
        .filter((dependency) => packageNames.has(dependency))
        .sort(),
    }));
  }
}
