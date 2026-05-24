// packages/cli/src/utils/run-script.ts

import { execa } from 'execa';

export async function runScript(script: string): Promise<void> {
  await execa('pnpm', [script], {
    stdio: 'inherit',
    shell: true,
  });
}
