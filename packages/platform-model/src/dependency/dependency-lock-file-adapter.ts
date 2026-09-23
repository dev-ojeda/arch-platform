// packages/platform-model/src/dependency/dependency-lock-file-adapter.ts

import type { DependencyLockfile } from './dependency-lock-file.js';

export interface DependencyLockfileAdapter {
  adapt(path: string): Promise<DependencyLockfile>;
}
