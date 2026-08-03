// packages/tooling/src/runtime/process/create-execa-options.ts
import type { Options } from 'execa';

import type { ExecuteProcessOptions } from '../execution/execute-process-option.js';
import { DEFAULT_PROCESS_OPTIONS } from '../execution/execute-process-option.js';

export function createExecaOptions(options: ExecuteProcessOptions): Options {
  const defaults = DEFAULT_PROCESS_OPTIONS;

  return {
    cwd: options.cwd,
    env: options.env,
    shell: options.shell ?? defaults.shell,
    stdin: options.stdin ?? defaults.stdin,
    stdout: options.stdout ?? defaults.stdout,
    stderr: options.stderr ?? defaults.stderr,
    preferLocal: true,
    reject: false,
  };
}
