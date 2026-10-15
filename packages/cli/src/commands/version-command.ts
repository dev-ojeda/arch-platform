// packages/cli/src/commands/version-command.ts

import process, { cwd } from 'node:process';

import type { CAC } from 'cac';

import { createVersionPackageUseCase } from '@arch-platform/application';

import type { VersionCliOptions } from '../contracts/version-cli-options.js';
import { renderVersionResult } from '../renderers/render-version.js';
import { logger } from '../ui/logger.js';

export async function runVersionCommand(options: VersionCliOptions): Promise<number> {
  try {
    const packageName = options.package?.replaceAll('\\', '/');
    const useCase = await createVersionPackageUseCase(cwd(), packageName);

    const result = await useCase.execute({
      packageName: packageName,
      releaseType: options.type,
      tagName: options.tag,
    });
    renderVersionResult(result);
    return result.success ? 0 : 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error(message);
    return 1;
  }
}

export function registerVersionCommand(cli: CAC): void {
  cli
    .command('version', 'Version Package')
    .option('--package <package>', 'Version package')
    .option('--type <type>', 'Version package')
    .option('--tag <tag>', 'Tag package')
    .action(async (options: VersionCliOptions) => {
      process.exitCode = await runVersionCommand(options);
    });
}
