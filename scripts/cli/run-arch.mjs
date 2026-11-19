// scripts/cli/run-arch.mjs
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Logger } from '../git/logger.mjs'; // Ajusta la ruta a tu logger.mjs

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(currentDir, '../../');
const cliEntry = resolve(workspaceRoot, 'packages/cli/dist/bin.js');
const cliBin = resolve(workspaceRoot, 'packages/cli/bin/arch.js');
const args = process.argv.slice(2);
const logger = new Logger();
if (!existsSync(cliEntry)) {
  logger.info('CLI no compilado. Ejecutando build de @arch-platform/cli...');

  const buildResult = spawnSync(
    'pnpm',
    ['exec', 'turbo', 'run', 'build', '--filter=@arch-platform/cli...'],
    {
      cwd: workspaceRoot,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
  );

  if (buildResult.status !== 0) {
    process.exit(buildResult.status ?? 1);
  }
}

const runResult = spawnSync(process.execPath, [cliBin, ...args], {
  cwd: workspaceRoot,
  stdio: 'inherit',
});

process.exit(runResult.status ?? 1);
