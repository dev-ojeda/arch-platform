// packages/tooling/src/commands/lint/lint.ts

import { NodeWorkspaceProvider, resolveLintTargets } from '@arch-platform/infrastructure';

import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { runTask } from '../../runtime/task/run-task.js';

import type { LintRequest } from './request.js';
import { runLintCommand } from './run.js';

export async function lintCommand(options: LintRequest): Promise<number> {
  const workspaceProvider = new NodeWorkspaceProvider();
  const workspace = await workspaceProvider.discover(options.workspaceRoot);
  const targets = resolveLintTargets(workspace, options.packageName);

  return runTask({
    task: ToolingTasks.lint,
    action: () =>
      runLintCommand({
        targets,
        args: options.fix ? ['--fix'] : options.debug ? ['--debug'] : [],
      }),
  });
}
