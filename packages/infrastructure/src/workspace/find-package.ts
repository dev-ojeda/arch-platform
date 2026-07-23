// packages/infrastructure/src/workspace/find-package.ts

import { pathExists, readDirectoryEntries } from '../filesystem/io/fs-async.js';
import { isDirectory } from '../filesystem/io/fs-sync.js';
import { joinPath } from '../filesystem/io/path-utils.js';

import { IGNORED_DIRECTORIES } from './ignored-directories.js';
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
