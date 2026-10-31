// packages/tooling/src/commands/typecheck/run.ts

import { NodeWorkspaceProvider } from '@arch-platform/infrastructure';

import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { createStopwatch } from '../../runtime/process/create-stopwatch.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import type { TaskResult } from '../../runtime/task/task-result.js';
import type { TypecheckCommandOptions } from '../common/command-options.js';
import { FileConfigNames } from '../config/config-file-name.js';

import { createTypecheckArguments } from './create-typecheck-arguments.js';

export async function runTypecheckCommand(
  options: TypecheckCommandOptions = {},
): Promise<TaskResult> {
  const {
    cwd = process.cwd(),
    packageName,
    configPath = FileConfigNames.tsconfig,
    noEmit = true,
    args = [],
  } = options;

  const workspaceProvider = new NodeWorkspaceProvider();
  const workspace = await workspaceProvider.discover(cwd);
  const packages = packageName
    ? workspace.packages.filter((pkg) => pkg.name === packageName)
    : workspace.packages;

  if (packageName && packages.length === 0) {
    throw new Error(`Package "${packageName}" was not found`);
  }

  const stopwatch = createStopwatch();
  let failed = false;

  for (const pkg of packages) {
    const result = await executeProcess('tsc', createTypecheckArguments(configPath, noEmit, args), {
      cwd: pkg.rootPath,
    });

    const metadata = {
      package: pkg.name,
      command: result.command,
      stderr: result.stderr,
      stdout: result.stdout,
      exitCode: result.exitCode,
      durationMs: result.durationMs,
    };

    if (result.exitCode !== 0) {
      failed = true;
      logger.error(ToolingTasks.typecheck.events.failed, { metadata });
      continue;
    }

    logger.info(ToolingTasks.typecheck.events.completed, { metadata });
  }

  return {
    status: failed ? 'failed' : 'completed',
    durationMs: stopwatch.elapsedSeconds(),
  };
}
