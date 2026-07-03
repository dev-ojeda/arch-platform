// packages/build-core/src/discovery/discover-packages-root.ts

import { joinPath } from '../fs/path-utils.js';
import { findPackageRoots } from '../package/find-package.js';
import type { PackageRoot } from '../package/packages-root.js';
import { readPackageJson } from '../package/read-package-json.js';
import { resolvePackageOutputs } from '../package/resolve-package-outputs.js';

export async function discoverWorkspacePackages(workspaceRoot: string): Promise<PackageRoot[]> {
  const packagesDir = joinPath(workspaceRoot, 'packages');

  const roots = await findPackageRoots(packagesDir);

  const packages = roots.map((root) => {
    const pkg = readPackageJson(joinPath(root, 'package.json'));

    const dependencies = Object.keys(pkg.dependencies ?? {}).sort();

    const buildDependencies = Object.keys(pkg.devDependencies ?? {})
      .filter((dep) => dep.startsWith('@arch/'))
      .sort();

    return {
      name: pkg.name,
      root,

      dependencies,

      buildDependencies,

      outputs: resolvePackageOutputs(pkg),

      build: pkg.arch?.build,
    };
  });

  return packages;
}
