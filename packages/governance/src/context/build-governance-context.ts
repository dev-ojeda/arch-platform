// packages/governance/src/context/build-governance-context.ts

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { parseJson } from '../helpers/helpers-json-parse.js';
import type {
  GovernanceBoundaries,
  GovernanceContext,
  PackageManifest,
  ResolvedPackage,
} from '../types/index.js';

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error;
}

function collectInternalDependencies(manifest: PackageManifest): string[] {
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.peerDependencies,
  };

  return Object.keys(dependencies ?? {}).filter((dependency) => dependency.startsWith('@arch/'));
}

async function loadBoundaries(packageRoot: string): Promise<GovernanceBoundaries | undefined> {
  const boundariesPath = join(packageRoot, '.boundaries.json');

  try {
    const content = await readFile(boundariesPath, 'utf8');

    return parseJson<GovernanceBoundaries>(content);
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return undefined;
    }

    console.warn(`[governance] failed to load boundaries: ${boundariesPath}`, error);

    return undefined;
  }
}

export async function buildGovernanceContext(workspaceRoot: string): Promise<GovernanceContext> {
  const packages: ResolvedPackage[] = [];

  const packagesRoot = join(workspaceRoot, 'packages');

  let directories: string[];

  try {
    directories = await readdir(packagesRoot);
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return {
        workspaceRoot,
        packages: [],
      };
    }

    throw error;
  }

  for (const directory of directories) {
    const packageRoot = join(packagesRoot, directory);

    const stats = await stat(packageRoot);

    if (!stats.isDirectory()) {
      continue;
    }

    const manifestPath = join(packageRoot, 'package.json');

    try {
      const content = await readFile(manifestPath, 'utf8');

      const manifest = parseJson<PackageManifest>(content);

      packages.push({
        name: manifest.name ?? directory,

        rootPath: packageRoot,

        manifestPath,

        manifest: {
          name: manifest.name ?? directory,

          arch: manifest.arch,

          version: manifest.version,

          private: manifest.private,

          type: manifest.type,

          dependencies: manifest.dependencies,

          devDependencies: manifest.devDependencies,

          peerDependencies: manifest.peerDependencies,
        },

        boundaries: await loadBoundaries(packageRoot),

        internalDependencies: collectInternalDependencies(manifest),
      });
    } catch (error) {
      if (isNodeError(error) && error.code === 'ENOENT') {
        continue;
      }

      throw error;
    }
  }

  return {
    workspaceRoot,

    packages,
  };
}
