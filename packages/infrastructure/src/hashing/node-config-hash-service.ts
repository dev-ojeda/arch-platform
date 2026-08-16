// packages/infrastructure/src/hashing/node-config-hash-service.ts

import type { ConfigHashService } from '@arch/contracts';

import { pathExistsSync, readNormalizedTextFileSync } from '../filesystem/io/fs-sync.js';
import { joinPath } from '../filesystem/io/path-utils.js';
import { safeStringify } from '../serialization/safe-stringify.js';

import { NodeHashService } from './node-hash-service.js';

const CONFIG_FILES = ['package.json', 'tsconfig.json', 'tsconfig.build.json', 'tsup.config.ts'];

export class NodeConfigHashService implements ConfigHashService {
  constructor(private readonly hashService: NodeHashService) {}
  hashConfig(root: string): string {
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
    return this.hashService.hash(safeStringify(parts, 2));
  }
}
