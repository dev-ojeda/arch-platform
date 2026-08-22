// packages/infrastructure/src/workspace/node-package-provider.ts

import type {
  PackageBoundaries,
  PackageDescriptor,
  PackageLayout,
  PackageManifest,
  PackageProvider,
} from '@arch/platform-model';

import { pathExists, readDirectoryEntries, readTextFile } from '../filesystem/io/fs-async.js';
import { isDirectory } from '../filesystem/io/fs-sync.js';
import { distPath, joinPath, srcPath, testPath } from '../filesystem/io/path-utils.js';
import { NodePathService } from '../filesystem/paths/node-path-service.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { loggerFactory } from '../logging/logger.js';
import { safeParse } from '../serialization/safe-stringify.js';

import { IGNORED_DIRECTORIES } from './ignored-directories.js';

export class NodePackageProvider implements PackageProvider {
  logger = loggerFactory.createLogger({
    component: 'NodePackageProvider',
  });
  private readonly pathService = new NodePathService();

  async discover(workspaceRoot: string): Promise<readonly PackageDescriptor[]> {
    const packageRoots = await this.findPackageRoots(joinPath(workspaceRoot, 'packages'));

    const packages = await Promise.all(
      packageRoots.map((packageRoot) => this.createPackageDescriptor(packageRoot)),
    );

    const archPackages = packages.filter((pkg) => pkg.name.startsWith('@arch/'));

    return this.resolveInternalDependencies(archPackages);
  }
  private async createPackageDescriptor(packageRoot: string): Promise<PackageDescriptor> {
    const manifestPath = joinPath(packageRoot, 'package.json');

    const [manifest, boundaries, layout] = await Promise.all([
      this.readPackageManifest(manifestPath),
      this.loadBoundaries(packageRoot),
      this.resolveLayout(packageRoot),
    ]);

    return {
      name: manifest.name,
      rootPath: packageRoot,
      manifestPath,
      manifest,
      boundaries,
      internalDependencies: [],
      layout,
    };
  }
  private async findPackageRoots(directory: string): Promise<string[]> {
    const roots: string[] = [];

    const entries = await readDirectoryEntries(directory);

    for (const entry of entries) {
      const fullPath = joinPath(directory, entry.name);

      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      if (!isDirectory(fullPath)) {
        continue;
      }

      const packageFile = joinPath(fullPath, 'package.json');

      if (await pathExists(packageFile)) {
        roots.push(fullPath);
      }

      // No retornamos: pueden existir nested packages.
      roots.push(...(await this.findPackageRoots(fullPath)));
    }

    return roots;
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

  private async readPackageManifest(path: string): Promise<PackageManifest> {
    const content = await readTextFile(path);
    const manifest = safeParse<PackageManifest>(content);

    if (!this.isPackageManifest(manifest)) {
      this.logger.error(LOG_EVENTS.INVALID_PACKAGE_MANIFEST, {
        source: {
          component: 'NodePackageProvider',
          operation: 'readPackageManifest',
        },
        metadata: {
          manifestPath: path,
          error: `Invalid manifest: ${path}`,
        },
      });

      throw new Error(`Invalid manifest: ${path}`);
    }

    return manifest;
  }

  private isPackageManifest(value: unknown): value is PackageManifest {
    return (
      typeof value === 'object' &&
      value !== null &&
      'name' in value &&
      typeof value.name === 'string'
    );
  }

  private async loadBoundaries(root: string): Promise<PackageBoundaries | undefined> {
    const boundariesPath = joinPath(root, '.boundaries.json');

    try {
      const boundaries = await readTextFile(boundariesPath);
      return safeParse<PackageBoundaries>(boundaries);
    } catch (error) {
      if (this.isNodeError(error) && error.code === 'ENOENT') {
        return undefined;
      }

      this.logger.error(LOG_EVENTS.NODE_WORKSPACE_PROVIDER_BOUNDARIES_LOAD_FAILED, {
        source: {
          component: 'NodePackageProvider',
          operation: 'loadBoundaries',
        },
        metadata: {
          boundariesPath,
          error,
        },
      });

      throw error;
    }
  }

  private async resolveLayout(root: string): Promise<PackageLayout> {
    const tsconfig = this.pathService.join(root, 'tsconfig.json');

    const [hasSourceDirectory, hasTestsDirectory, hasDistributionDirectory, hasTsconfig] =
      await Promise.all([
        pathExists(srcPath(root)),
        pathExists(testPath(root)),
        pathExists(distPath(root)),
        pathExists(tsconfig),
      ]);

    return {
      sourceDirectory: srcPath(root),
      hasSourceDirectory,

      testsDirectory: testPath(root),
      hasTestsDirectory,

      distributionDirectory: distPath(root),
      hasDistributionDirectory,

      tsconfigPath: tsconfig,
      hasTsconfig,
    };
  }

  private isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return typeof error === 'object' && error !== null && 'code' in error;
  }
}
