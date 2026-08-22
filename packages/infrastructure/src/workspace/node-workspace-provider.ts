// packages/infrastructure/src/workspace/node-workspace-provider.ts

import type { PathService } from '@arch/contracts';
import type {
  PackageProvider,
  WorkspaceDescriptor,
  WorkspaceLayout,
  WorkspaceProvider,
} from '@arch/platform-model';

import { pathExists } from '../filesystem/io/fs-async.js';
import { pathExistsSync } from '../filesystem/io/fs-sync.js';
import { NodePathService } from '../filesystem/paths/node-path-service.js';

import { NodePackageProvider } from './node-package-provider.js';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';

export class NodeWorkspaceProvider implements WorkspaceProvider {
  constructor(
    private readonly packageProvider: PackageProvider = new NodePackageProvider(),
    private readonly pathService: PathService = new NodePathService(),
  ) {}

  async discover(fromDirectory: string): Promise<WorkspaceDescriptor> {
    const workspaceRoot = this.findWorkspaceRoot(fromDirectory);

    const packages = await this.packageProvider.discover(workspaceRoot);

    return {
      root: workspaceRoot,
      layout: await this.resolveWorkspaceLayout(workspaceRoot),
      packages,
    };
  }

  private findWorkspaceRoot(fromDirectory: string): string {
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

  private async resolveWorkspaceLayout(root: string): Promise<WorkspaceLayout> {
    const packageJsonPath = this.pathService.join(root, 'package.json');
    const tsconfigPath = this.pathService.join(root, 'tsconfig.json');

    const configDirectory = this.pathService.join(root, 'config');
    const archManifestPath = this.pathService.join(configDirectory, 'arch.manifest.json');

    const [hasPackageManifest, hasTsconfig, hasArchManifest] = await Promise.all([
      pathExists(packageJsonPath),
      pathExists(tsconfigPath),
      pathExists(archManifestPath),
    ]);

    return {
      packageJsonPath,
      tsconfigPath,
      archManifestPath,
      hasPackageManifest,
      hasTsconfig,
      hasArchManifest,
    };
  }
}
