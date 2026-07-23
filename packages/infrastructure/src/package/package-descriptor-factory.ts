// packages/infrastructure/src/package/package-descriptor-factory.ts

import type {
  PackageBoundaries,
  PackageDescriptor,
  PackageLayout,
  PackageManifest,
} from '@arch/platform-model';

import { pathExists, readTextFile } from '../filesystem/io/fs-async.js';
import { distPath, joinPath, srcPath, testPath } from '../filesystem/io/path-utils.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { loggerFactory } from '../logging/logger.js';
import { safeParse } from '../serialization/safe-stringify.js';

export class PackageDescriptorFactory {
  logger = loggerFactory.createLogger({
    component: 'PackageDescriptorFactory',
  });
  async create(packageRoot: string): Promise<PackageDescriptor> {
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

  private async readPackageManifest(path: string): Promise<PackageManifest> {
    const manifest = await readTextFile(safeParse(path));

    if (!this.isPackageManifest(manifest)) {
      this.logger.error(LOG_EVENTS.INVALID_PACKAGE_MANIFEST, {
        source: {
          component: 'PackageDescriptorFactory',
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
          component: 'PackageDescriptorFactory',
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
    const [hasSourceDirectory, hasTestsDirectory, hasDistributionDirectory] = await Promise.all([
      pathExists(srcPath(root)),
      pathExists(testPath(root)),
      pathExists(distPath(root)),
    ]);

    return {
      sourceDirectory: srcPath(root),
      hasSourceDirectory,

      testsDirectory: testPath(root),
      hasTestsDirectory,

      distributionDirectory: distPath(root),
      hasDistributionDirectory,
    };
  }

  private isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return typeof error === 'object' && error !== null && 'code' in error;
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
