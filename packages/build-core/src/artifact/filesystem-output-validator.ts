// packages/build-core/src/artifact/filesystem-output-validator.ts

import { pathExistsSync } from '../fs/fs-sync.js';
import { joinPath } from '../fs/path-utils.js';

import type { OutputValidator } from './output-validator.js';

export class FilesystemOutputValidator implements OutputValidator {
  exists(root: string, outputs: string[]): boolean {
    return outputs.every((output) => pathExistsSync(joinPath(root, output)));
  }
}
