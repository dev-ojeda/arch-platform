// packages/tooling/src/commands/dev/dev-command.ts

import { executeCommand } from '../../runtime/execute-command.js';
import { fileExists } from '../../utils/file-exists.js';
import { FileConfigNames } from '../config/config-file-name.js';

export async function runDevCommand(): Promise<number> {
  if (!fileExists(FileConfigNames.tsupConfig)) {
    return 0;
  }

  const result = await executeCommand('tsup', ['--watch']);

  return result.exitCode;
}
