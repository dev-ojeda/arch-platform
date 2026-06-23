// packages/tooling/src/commands/build.ts

import { BuildApplicationFactory } from '@arch/build-core';

import { logger } from '../logging/logger.js';
import { commandRunner } from '../runtime/command-runner.js';
import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runCommand } from '../runtime/run-command.js';
import { findWorkspaceRoot } from '../workspace/find-workspace-root.js';

export async function buildCommand(packageName: string): Promise<number> {
  return runCommand({
    events: ToolingEvents.build,

    action: async () => {
      const root = findWorkspaceRoot(process.cwd());

      const app = new BuildApplicationFactory(root, commandRunner);

      const service = await app.create();

      const summary = await service.run({
        packageName,
      });

      logger.success(ToolingEvents.build.completed, {
        metadata: {
          executed: summary.executed,
          restored: summary.restored,
          cached: summary.cached,
          failed: summary.failed,
        },
      });

      return summary.failed === 0 ? 0 : 1;
    },
  });
}
