// packages/infrastructure/src/workspace/node-workspace-provider.ts

import type {
  PackageDescriptor,
  WorkspaceDescriptor,
  WorkspaceLayout,
  WorkspaceProvider,
} from '@arch/platform-model';

import { pathExists } from '../filesystem/io/fs-async.js';
import { pathExistsSync } from '../filesystem/io/fs-sync.js';
import { joinPath } from '../filesystem/io/path-utils.js';
import { NodePathService } from '../filesystem/paths/node-path-service.js';
import { PackageDescriptorFactory } from '../package/package-descriptor-factory.js';

import { findPackageRoots } from './find-package.js';
import { findWorkspaceRoot } from './find-workspace-root.js';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';

export class NodeWorkspaceProvider implements WorkspaceProvider {
  private readonly descriptorFactory = new PackageDescriptorFactory();
  private readonly pathService = new NodePathService();

  findRoot(fromDirectory: string): string {
    let current = this.pathService.resolve(fromDirectory);

    while (true) {
      const workspaceFile = this.pathService.join(current, WORKSPACE_FILE);

      if (pathExistsSync(workspaceFile)) {
        return current;
      }

      const parent = this.pathService.dirname(current);

      if (parent === current) {
        throw new Error(`Unable to locate workspace root from "${fromDirectory}"`);
      }

      current = parent;
    }
  }
  async discover(root: string): Promise<WorkspaceDescriptor> {
    const workspaceRoot = findWorkspaceRoot(root);

    const packageRoots = await findPackageRoots(joinPath(workspaceRoot, 'packages'));

    const packages = await Promise.all(
      packageRoots.map((packageRoot) => this.descriptorFactory.create(packageRoot)),
    );
    const resolvedPackages = this.resolveInternalDependencies(packages);
    return {
      root: workspaceRoot,
      layout: await this.resolveWorkspaceLayout(workspaceRoot),
      packages: resolvedPackages,
    };
  }

  private async resolveWorkspaceLayout(root: string): Promise<WorkspaceLayout> {
    const packageJsonPath = joinPath(root, 'package.json');
    const tsconfigPath = joinPath(root, 'tsconfig.json');

    const [hasPackageManifest, hasTsconfig] = await Promise.all([
      pathExists(packageJsonPath),
      pathExists(tsconfigPath),
    ]);

    return {
      packageJsonPath,
      tsconfigPath,
      hasPackageManifest,
      hasTsconfig,
    };
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
