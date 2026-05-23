// packages/tooling/src/runtime/execute-command.ts

import { execa } from 'execa';

export async function executeCommand(command: string, args: string[] = []) {
  await execa(command, args, {
    stdio: 'inherit',
    shell: true,
  });
}
