// packages/infrastructure/src/workspace/discover-workspace-packages.ts

import type { WorkspacePackage } from '@arch/platform-model';

import { joinPath } from '../filesystem/io/path-utils.js';

import { findPackageRoots } from './find-package.js';
import { readPackageJson } from './read-package-json.js';
import { resolvePackageOutputs } from './resolve-package-outputs.js';

export async function discoverWorkspacePackages(
  workspaceRoot: string,
): Promise<WorkspacePackage[]> {
  const packagesDir = joinPath(workspaceRoot, 'packages');

  const roots = await findPackageRoots(packagesDir);

  return roots.map((root) => {
    const pkg = readPackageJson(joinPath(root, 'package.json'));

    return {
      name: pkg.name,
      root,

      dependencies: Object.keys(pkg.dependencies ?? {}).sort(),

      buildDependencies: Object.keys(pkg.devDependencies ?? {})
        .filter((dep) => dep.startsWith('@arch/'))
        .sort(),

      outputs: resolvePackageOutputs(pkg),

      build: pkg.arch?.build,
    };
  });
}
