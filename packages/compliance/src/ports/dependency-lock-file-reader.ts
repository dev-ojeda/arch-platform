// packages/compliance/src/ports/dependency-lock-file-reader.ts

import type { DependencyLockfile } from '../dependency/dependency-lock-file.js';

export interface DependencyLockfileReader {
  read(path: string): Promise<DependencyLockfile>;
}
