// packages/cli/src/utils/command-runner.ts

import { execa } from 'execa';

export async function runCommand(command: string, args: string[] = []) {
  const subprocess = execa(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  await subprocess;
}
