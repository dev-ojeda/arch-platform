// packages/contracts/src/generation/generated-file.ts

import type { OverwritePolicy } from '../filesystem/overwrite-policy.js';

export interface GeneratedFile {
  /*
   * Relative output path
   */

  readonly path: string;

  /*
   * Final rendered content
   */

  readonly content: string;

  /*
   * Indicates overwrite behavior
   */

  readonly overwrite?: OverwritePolicy;
}
