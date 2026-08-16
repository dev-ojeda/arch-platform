// packages/infrastructure/src/public/node-architecture-provider.ts

import type {
  ArchitectureLayout,
  ArchitectureManifest,
  ArchitecturePackage,
  ArchitectureProvider,
} from '@arch/platform-model';

import { readTextFile } from '../filesystem/io/fs-async.js';
import { configPath } from '../filesystem/io/path-utils.js';
import { NodePathService } from '../filesystem/paths/node-path-service.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { loggerFactory } from '../logging/logger.js';
import { safeParse } from '../serialization/safe-stringify.js';

export class NodeArchitectureProvider implements ArchitectureProvider {
  private readonly pathService = new NodePathService();
  logger = loggerFactory.createLogger({
    component: 'NodeArchitectureProvider',
  });
  async load(path: string): Promise<ArchitectureManifest> {
    const root = this.pathService.resolve(path);
    const layout = this.resolveArchitectureLayout(root);
    const manifestPath = this.pathService.join(layout.config, 'arch.manifest.json');

    const [manifest] = await Promise.all([this.readArchitectureManifest(manifestPath)]);

    return {
      schemaVersion: manifest.schemaVersion,
      workspace: manifest.workspace,
      packages: manifest.packages,
    };
  }

  private resolveArchitectureLayout(root: string): ArchitectureLayout {
    const config = this.pathService.join(configPath(root));

    return {
      root,
      config,
    };
  }
  private async readArchitectureManifest(path: string): Promise<ArchitectureManifest> {
    const content = await readTextFile(path);
    const manifest = safeParse<ArchitectureManifest>(content);

    if (!this.isArchitectureManifest(manifest)) {
      this.logger.error(LOG_EVENTS.INVALID_PACKAGE_MANIFEST, {
        source: {
          component: 'NodeArchitectureProvider',
          operation: 'readArchitecturePackage',
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

  private isArchitectureManifest(value: unknown): value is ArchitectureManifest {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    if (!('schemaVersion' in value) || typeof value.schemaVersion !== 'number') {
      return false;
    }

    if (
      !('workspace' in value) ||
      typeof value.workspace !== 'object' ||
      value.workspace === null
    ) {
      return false;
    }

    if (!('packages' in value) || !Array.isArray(value.packages)) {
      return false;
    }

    return value.packages.every((pkg) => this.isArchitecturePackage(pkg));
  }

  private isArchitecturePackage(value: unknown): value is ArchitecturePackage {
    return (
      typeof value === 'object' &&
      value !== null &&
      'name' in value &&
      typeof value.name === 'string' &&
      'path' in value &&
      typeof value.path === 'string'
    );
  }
}
