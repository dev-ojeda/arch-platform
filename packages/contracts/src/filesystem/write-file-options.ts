// packages/contracts/src/filesystem/write-file-options.ts

import type { OverwritePolicy } from './overwrite-policy.js';

export interface WriteFileOptions {
  overwrite?: OverwritePolicy;
}
