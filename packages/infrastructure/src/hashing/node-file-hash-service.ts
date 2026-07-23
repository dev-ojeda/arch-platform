// packages/infrastructure/src/hashing/node-file-hash-service.ts

import type { FileHashService, HashService } from '@arch/contracts';

import { fileSizeSync, readBufferSync } from '../filesystem/io/fs-sync.js';
import { resolvePath } from '../filesystem/io/path-utils.js';

export class NodeFileHashService implements FileHashService {
  constructor(private readonly hashService: HashService) {}

  hashFile(filePath: string): string {
    const absolutePath = resolvePath(filePath);

    const buffer = readBufferSync(absolutePath);
    const size = fileSizeSync(absolutePath);

    return this.hashService.hash(Buffer.concat([Buffer.from(`${size}:`), buffer]).toString());
  }
}
