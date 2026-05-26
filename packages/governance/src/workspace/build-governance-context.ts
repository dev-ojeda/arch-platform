import fs from 'node:fs/promises';
import path from 'node:path';

import type { GovernanceContext, GovernancePackage } from '../context/governance-context.js';

export async function buildGovernanceContext(workspaceRoot: string): Promise<GovernanceContext> {
  const packages: GovernancePackage[] = [];

  const packagesRoot = path.join(workspaceRoot, 'packages');

  const packageDirectories = await fs.readdir(packagesRoot);

  for (const directory of packageDirectories) {
    const packageRoot = path.join(packagesRoot, directory);

    const manifestPath = path.join(packageRoot, 'package.json');

    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf8');

      const manifest = JSON.parse(manifestContent);

      packages.push({
        name: manifest.name,

        rootPath: packageRoot,

        manifestPath,

        manifest: {
          version: manifest.version,

          private: manifest.private,

          dependencies: manifest.dependencies,

          devDependencies: manifest.devDependencies,

          peerDependencies: manifest.peerDependencies,

          arch: manifest.arch,
        },
      });
    } catch {
      continue;
    }
  }

  return {
    workspaceRoot,

    packages,
  };
}
