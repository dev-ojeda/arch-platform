// packages/cli/src/commands/inspect-command.ts

import type { CAC } from 'cac';

import { createInspectArtifactUseCase } from '@arch-platform/application';

import type { InspectCliOptions } from '../contracts/inspect-cli-options.js';
import { renderInspectResult } from '../renderers/render-inspect.js';
import { logger } from '../ui/logger.js';

export async function runInspectCommand(options: InspectCliOptions): Promise<number> {
  try {
    const workspaceRoot = process.cwd();

    const useCase = await createInspectArtifactUseCase(workspaceRoot);

    const result = await useCase.execute({
      artifact: options.package,
    });
    renderInspectResult(result);
    return result.success ? 0 : 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error(message);
    return 1;
  }
}

export function registerInspectCommand(cli: CAC): void {
  cli
    .command('inspect', 'Inspect artifact')
    .option('--package <package>', 'Inspect package')
    .action(async (options: InspectCliOptions) => {
      process.exitCode = await runInspectCommand(options);
    });
}
