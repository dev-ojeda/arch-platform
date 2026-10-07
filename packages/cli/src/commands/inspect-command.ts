// packages/cli/src/commands/inspect-command.ts

import process from 'node:process';

import type { CAC } from 'cac';

import { createInspectArtifactUseCase } from '@arch-platform/application';

import type { InspectCliOptions } from '../contracts/inspect-cli-options.js';
import { renderInspectResult } from '../renderers/render-inspect.js';

export async function runInspectCommand(options: InspectCliOptions): Promise<number> {
  try {
    const workspaceRoot = process.cwd();

    const useCase = await createInspectArtifactUseCase(workspaceRoot);

    const result = await useCase.execute({
      artifact: options.package,
    });
    renderInspectResult(result);
    return result.success ? 0 : 1;
  } catch {
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
