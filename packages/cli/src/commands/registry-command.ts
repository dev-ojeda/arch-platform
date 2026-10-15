// packages/cli/src/commands/registry-command.ts

import process from 'node:process';

import type { CAC } from 'cac';

import { createSyncRegistryUseCase } from '@arch-platform/application';

import type { RegistryCliOptions } from '../contracts/registry-cli-options.js';
import { renderSyncResult } from '../renderers/render-sync.js';
import { logger } from '../ui/logger.js';

export async function runSyncRegistryCommand(options: RegistryCliOptions): Promise<number> {
  try {
    const workspaceRoot = process.cwd();
    const useCase = await createSyncRegistryUseCase(workspaceRoot);

    const result = await useCase.execute({
      artifact: options.package,
      scope: options.scope ?? '@arch-platform',
    });

    renderSyncResult(result);

    return result.success ? 0 : 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error(message);
    return 1;
  }
}

export function registerSyncCommand(cli: CAC): void {
  cli
    .command('sync', 'Sync Registry packages')
    .option('--package <package>', 'Sync a specific registry package')
    .option('--scope <scope>', 'Sync all packages under a registry scope')
    .action(async (options: RegistryCliOptions) => {
      process.exitCode = await runSyncRegistryCommand(options);
    });
}
