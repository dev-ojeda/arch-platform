// 📦 Paquetes Core (Packages)/distribution/src/commands/build.command.ts

import type { CAC } from 'cac';

import type { BuildServiceSummary } from '@arch-platform/build-core';
import { BuildApplicationFactory } from '@arch-platform/build-core';

import type { BuildCliOptions } from '../contracts/build-cli-options.js';
import type { BuildCommandOptions } from '../contracts/build-command-options.js';
import { processRunner } from '../process/process-runner.js';
import { logger } from '../ui/logger.js';

import { createBuildScope } from './build.scope.js';

export function registerBuildCommand(cli: CAC): void {
  cli
    .command('build')
    .option('--package <packageName>', 'Build specific package')
    .action(async (options: BuildCliOptions) => {
      process.exitCode = await buildCommand({
        packageName: options.package,
      });
    });
}

// La configuración mínima necesaria para ejecutar el build.
// La presentación pertenece al CLI.

export async function buildCommand(options: BuildCommandOptions): Promise<number> {
  const app = new BuildApplicationFactory(process.cwd(), processRunner);
  const service = await app.create();

  const summary: BuildServiceSummary = await service.run({
    scope: createBuildScope(options),
  });

  const succeeded = summary.failed === 0;

  logger.newline();
  logger.info('ARCH Build');
  logger.info('────────────────────────────────────────────');

  logger[succeeded ? 'success' : 'error'](
    succeeded ? 'Status: BUILD COMPLETED' : 'Status: BUILD FAILED',
  );

  logger.info(
    `Executed: ${summary.executed} · ` +
      `Restored: ${summary.restored} · ` +
      `Cached: ${summary.cached} · ` +
      `Failed: ${summary.failed}`,
  );

  logger.newline();

  return succeeded ? 0 : 1;
}
