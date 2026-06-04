// packages\governance\src\workspace\build-governance-context.ts
import fs from 'node:fs/promises';
import path from 'node:path';

import type {
  GovernanceBoundaries,
  GovernanceContext,
  GovernancePackage,
  GovernancePackageManifest,
} from '../context/governance-context.js';
import { parseJson } from '../helpers/helpers-json-parse.js';

function collectInternalDependencies(manifest: GovernancePackageManifest): string[] {
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.peerDependencies,
  };

  return Object.keys(dependencies ?? {}).filter((dependency) => dependency.startsWith('@arch/'));
}

async function loadBoundaries(packageRoot: string): Promise<GovernanceBoundaries | undefined> {
  const boundariesPath = path.join(packageRoot, '.boundaries.json');

  try {
    const content = await fs.readFile(boundariesPath, 'utf8');

    return parseJson<GovernanceBoundaries>(content);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }

    console.warn(`[governance] failed to load boundaries: ${boundariesPath}`, error);

    return undefined;
  }
}

export async function buildGovernanceContext(workspaceRoot: string): Promise<GovernanceContext> {
  const packages: GovernancePackage[] = [];

  const packagesRoot = path.join(workspaceRoot, 'packages');

  const packageDirectories = await fs.readdir(packagesRoot);

  for (const directory of packageDirectories) {
    const packageRoot = path.join(packagesRoot, directory);

    const stat = await fs.stat(packageRoot);

    if (!stat.isDirectory()) {
      continue;
    }

    const manifestPath = path.join(packageRoot, 'package.json');

    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf8');

      const manifest = parseJson<GovernancePackageManifest>(manifestContent);

      const boundaries = await loadBoundaries(packageRoot);

      packages.push({
        name: manifest.name ?? directory,

        rootPath: packageRoot,

        manifestPath,

        packageJson: {
          version: manifest.version,

          private: manifest.private,

          type: manifest.type,

          dependencies: manifest.dependencies,

          devDependencies: manifest.devDependencies,

          peerDependencies: manifest.peerDependencies,

          arch: manifest.arch,
        },

        boundaries,

        internalDependencies: collectInternalDependencies(manifest),
      });
    } catch (error) {
      console.warn(`[governance] failed to load package: ${manifestPath}`, error);
    }
  }

  return {
    workspaceRoot,

    packages,
  };
}
