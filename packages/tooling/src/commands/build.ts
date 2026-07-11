// packages/tooling/src/commands/build.ts

import { cwd } from 'node:process';

import { BuildApplicationFactory } from '@arch/build-core';

import { logger } from '../logging/logger.js';
import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { processRunner } from '../runtime/process/process-runner.js';
import { runTask } from '../runtime/task/run-task.js';

import type { BuildCommandOptions } from './command-options.js';

export async function buildCommand(options: BuildCommandOptions): Promise<number> {
  return runTask({
    events: ToolingEvents.build,

    action: async () => {
      const app = new BuildApplicationFactory(cwd(), processRunner);

      const service = await app.create();

      const summary = await service.run({
        packageName: options.packageName,
      });

      logger.success(ToolingEvents.build.completed, {
        metadata: {
          executed: summary.executed,
          restored: summary.restored,
          cached: summary.cached,
          failed: summary.failed,
        },
      });

      return {
        ...summary,
        exitCode: summary.failed === 0 ? 0 : 1,
      };
    },
  });
}
