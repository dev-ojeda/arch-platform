// packages/cli/src/commands/publish-command.ts

import process from 'node:process';

import type { CAC } from 'cac';

import { createPublishArtifactUseCase } from '@arch-platform/application';

import type { PublishCliOptions } from '../contracts/publish-cli-options.js';
import { renderPublishResult } from '../renderers/render-publish.js';

export async function runPublishCommand(options: PublishCliOptions): Promise<number> {
  try {
    const workspaceRoot = process.cwd();

    const useCase = createPublishArtifactUseCase(workspaceRoot);

    const result = await useCase.execute({
      environment: options.env,
      artifact: options.package,
    });
    renderPublishResult(result);
    return result.success ? 0 : 1;
  } catch {
    return 1;
  }
}

export function registerPublishCommand(cli: CAC): void {
  cli
    .command('publish', 'Publish artifact')
    .option('--package <package>', 'Publish package')
    .option('--env <environment>', 'Publish environment')
    .action(async (options: PublishCliOptions) => {
      process.exitCode = await runPublishCommand(options);
    });
}
