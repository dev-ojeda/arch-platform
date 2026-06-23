// packages/build-core/src/workspace/discover-workspace-packages.ts

import { joinPath } from '../fs/path-utils.js';

import { findPackageRoots } from './find-package-roots.js';
import { readPackageJson } from './read-package-json.js';
import { resolveOutputs } from './resolve-package-outputs.js';
import type { WorkspacePackage } from './workspace-package.js';

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
      dependencies: Object.keys(pkg.dependencies ?? {}),
      outputs: resolveOutputs(pkg),
    };
  });
}
