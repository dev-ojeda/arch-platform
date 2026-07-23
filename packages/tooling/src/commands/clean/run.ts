// packages/tooling/src/commands/clean/run.ts

import { collectTsBuildInfoFiles, removePaths } from '@arch/infrastructure';

import { logger } from '../../logging/logger.js';
import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import type { TaskResult } from '../../runtime/index.js';
import { createStopwatch } from '../../runtime/process/create-stopwatch.js';
import type { CleanCommandOptions } from '../common/command-options.js';

import { createPathsToRemove } from './create-paths-to-remove.js';
import { resolveCleanOptions } from './resolve-clean-options.js';

export async function runCleanCommand(options: CleanCommandOptions = {}): Promise<TaskResult> {
  const stopwatch = createStopwatch();
  const resolvedOptions = resolveCleanOptions(options);

  await removePaths(createPathsToRemove(resolvedOptions.cwd, resolvedOptions));

  if (resolvedOptions.removeTsBuildInfo) {
    const files = await collectTsBuildInfoFiles(resolvedOptions.cwd);

    await removePaths(files);
  }

  logger.success(ToolingEvents.clean.completed, {
    metadata: {
      cwd: resolvedOptions.cwd,
      removeDist: resolvedOptions.removeDist,
      removeCoverage: resolvedOptions.removeCoverage,
      removeTsBuildInfo: resolvedOptions.removeTsBuildInfo,
      removeTurbo: resolvedOptions.removeTurbo,
      durationMs: stopwatch.elapsed(),
    },
  });

  return { exitCode: 0 };
}
