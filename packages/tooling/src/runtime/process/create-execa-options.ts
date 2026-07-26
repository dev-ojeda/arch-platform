// packages/tooling/src/runtime/process/create-execa-options.ts
import {
  DEFAULT_EXECUTION_OPTIONS,
  type ExecuteCommandOptions,
} from '../execution/execute-command-option.js';

import type { Options } from 'execa';


export function createExecaOptions(options: ExecuteCommandOptions): Options {
  const defaults = DEFAULT_EXECUTION_OPTIONS;

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
