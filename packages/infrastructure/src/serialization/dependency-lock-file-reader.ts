// packages/infrastructure/src/serialization/dependency-lock-file-reader.ts

import type { DependencyLockfile, DependencyLockfileReader } from '@arch-platform/compliance';

import { readTextFile } from '../filesystem/io/fs-async.js';

import { parseYaml } from './parse-yaml.js';

export class DefaultDependencyLockfileReader implements DependencyLockfileReader {
  async read(path: string): Promise<DependencyLockfile> {
    const content = await readTextFile(path);

    return parseYaml<DependencyLockfile>(content);
  }
}
