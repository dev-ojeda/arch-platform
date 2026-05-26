// packages/tooling/src/runtime/execute-command.ts

import { execa, type Options as ExecaOptions } from 'execa';

export interface ExecuteCommandOptions {
  cwd?: string;

  env?: NodeJS.ProcessEnv;

  shell?: boolean;

  stdin?: 'inherit' | 'pipe';

  stdout?: 'inherit' | 'pipe';

  stderr?: 'inherit' | 'pipe';
}

export interface ExecuteCommandResult {
  exitCode: number;

  stdout: string;

  stderr: string;
}

function normalizeOutput(value: string | Uint8Array | unknown[] | undefined): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value).toString('utf8');
  }

  if (Array.isArray(value)) {
    return value.join('\n');
  }

  return '';
}

export async function executeCommand(
  command: string,
  args: string[] = [],
  options: ExecuteCommandOptions = {},
): Promise<ExecuteCommandResult> {
  const execaOptions: ExecaOptions = {
    cwd: options.cwd,

    env: options.env,

    shell: options.shell ?? false,

    stdin: options.stdin ?? 'inherit',

    stdout: options.stdout ?? 'inherit',

    stderr: options.stderr ?? 'inherit',

    preferLocal: true,

    reject: false,
  };

  const result = await execa(command, args, execaOptions);

  return {
    exitCode: result.exitCode ?? 0,

    stdout: normalizeOutput(result.stdout),

    stderr: normalizeOutput(result.stderr),
  };
}
