// packages/build-core/src/hash/filesystem/hash-file.ts

import { fileSizeSync, readBufferSync } from '../../fs/fs-sync.js';
import { resolvePath } from '../../fs/path-utils.js';
import { createHash } from '../hash-utils.js';

export function hashFile(filePath: string): string {
  const absolutePath = resolvePath(filePath);

  const buffer = readBufferSync(absolutePath);
  const size = fileSizeSync(absolutePath);

  return createHash(Buffer.concat([Buffer.from(`${size}:`), buffer]));
}
