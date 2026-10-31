// packages/tooling/src/commands/clean/run.ts

import {
  collectTsBuildInfoFiles,
  NodeWorkspaceProvider,
  removePaths,
} from '@arch-platform/infrastructure';

import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import type { TaskResult } from '../../runtime/index.js';
import { createStopwatch } from '../../runtime/process/create-stopwatch.js';
import type { CleanCommandOptions } from '../common/command-options.js';

import { createPathsToRemove } from './create-paths-to-remove.js';
import { resolveCleanOptions } from './resolve-clean-options.js';

export async function runCleanCommand(options: CleanCommandOptions = {}): Promise<TaskResult> {
  const stopwatch = createStopwatch();
  const workspaceProvider = new NodeWorkspaceProvider();

  const resolvedOptions = resolveCleanOptions(options);
  const workspace = await workspaceProvider.discover(resolvedOptions.cwd);

  const packages = resolvedOptions.packageName
    ? workspace.packages.filter((pkg) => pkg.name === resolvedOptions.packageName)
    : workspace.packages;

  if (packages.length === 0) {
    throw new Error('No matching packages found for clean');
  }

  for (const pkg of packages) {
    await removePaths(createPathsToRemove(pkg.rootPath, resolvedOptions));

    if (resolvedOptions.removeTsBuildInfo) {
      const files = await collectTsBuildInfoFiles(pkg.rootPath);
      await removePaths(files);
    }
  }
  const durationMs = stopwatch.elapsed();
  logger.success(ToolingTasks.clean.events.completed, {
    metadata: {
      cwd: resolvedOptions.cwd,
      removeDist: resolvedOptions.removeDist,
      removeCoverage: resolvedOptions.removeCoverage,
      removeTsBuildInfo: resolvedOptions.removeTsBuildInfo,
      durationMs,
    },
  });

  return {
    status: 'completed',
    durationMs,
  };
}
