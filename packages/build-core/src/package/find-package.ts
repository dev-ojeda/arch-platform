// packages/build-core/src/package/find-package.ts

import { IGNORED_DIRECTORIES } from '../discovery/ignored-directories.js';
import { pathExists, readDirectoryEntries } from '../fs/fs-async.js';
import { isDirectory } from '../fs/fs-sync.js';
import { joinPath } from '../fs/path-utils.js';

import { isPackageJson, readPackageJson } from './read-package-json.js';

export async function findPackageRoots(directory: string): Promise<string[]> {
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
      const pkg = readPackageJson(packageFile);

      if (isPackageJson(pkg) && pkg.name.startsWith('@arch/')) {
        roots.push(fullPath);
      }

      // importante:
      // no hacemos return porque puede haber nested packages
    }

    roots.push(...(await findPackageRoots(fullPath)));
  }

  return roots;
}
