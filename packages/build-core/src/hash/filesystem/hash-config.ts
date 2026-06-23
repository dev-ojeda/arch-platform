// packages/build-core/src/hash/filesystem/hash-config.ts

import { pathExistsSync, readNormalizedTextFileSync } from '../../fs/fs-sync.js';
import { joinPath } from '../../fs/path-utils.js';
import { createHash } from '../hash-utils.js';

const CONFIG_FILES = ['package.json', 'tsconfig.json', 'tsconfig.build.json', 'tsup.config.ts'];

export function hashConfig(root: string): string {
  const parts: string[] = [];

  for (const file of CONFIG_FILES) {
    const full = joinPath(root, file);

    if (!pathExistsSync(full)) {
      continue;
    }

    const content = readNormalizedTextFileSync(full);

    parts.push(file);
    parts.push(content);
  }

  return createHash(JSON.stringify(parts));
}
