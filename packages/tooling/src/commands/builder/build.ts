// packages/tooling/src/commands/builder/build.ts

import { cwd } from 'node:process';

import { BuildApplicationFactory } from '@arch/build-core';

import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { createStopwatch } from '../../runtime/process/create-stopwatch.js';
import { processRunner } from '../../runtime/process/process-runner.js';
import { runTask } from '../../runtime/task/run-task.js';
import { formatDuration } from '../../utils/format-duration.js';
import type { BuildCommandOptions } from '../common/command-options.js';

import { createBuildScope } from './build-scope.js';
import type { BuildTaskResult } from './build-task-result.js';

export async function buildCommand(options: BuildCommandOptions): Promise<number> {
  return runTask({
    task: ToolingTasks.build,

    action: async (): Promise<BuildTaskResult> => {
      const stopwatch = createStopwatch();

      const app = new BuildApplicationFactory(cwd(), processRunner);

      const service = await app.create();

      const summary = await service.run({
        scope: createBuildScope(options),
      });

      const durationMs = formatDuration(stopwatch.elapsed());

      logger.success(ToolingTasks.build.events.completed, {
        metadata: {
          executed: summary.executed,
          restored: summary.restored,
          cached: summary.cached,
          failed: summary.failed,
          durationMs,
        },
      });

      return {
        status: summary.failed === 0 ? 'completed' : 'failed',
        summary,
      };
    },
  });
}
