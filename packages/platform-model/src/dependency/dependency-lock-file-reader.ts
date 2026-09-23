// packages/platform-model/src/dependency/dependency-lock-file-reader.ts

import type { DependencyLockfile } from './dependency-lock-file.js';

export interface DependencyLockfileReader {
  read(workspaceRoot: string, lockfilePath: string): Promise<DependencyLockfile>;
}
