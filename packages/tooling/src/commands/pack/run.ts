// packages/tooling/src/commands/pack/run.ts

import { resolve } from 'node:path';

import { NodeWorkspaceProvider } from '@arch-platform/infrastructure';

import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import { createProcessTaskResult } from '../../runtime/task/create-process-task-result.js';
import type { TaskProcessResult } from '../../runtime/task/task-process-result.js';
import type { PackCommandOptions } from '../common/command-options.js';

import { createPackArguments } from './create-pack-arguments.js';

export async function runPackCommand(options: PackCommandOptions): Promise<TaskProcessResult> {
  const { args = [], cwd, packageName, outputDirectory = 'artifacts' } = options;

  if (!packageName) {
    throw new Error('Pack requires a package name');
  }

  const workspaceProvider = new NodeWorkspaceProvider();
  const workspace = await workspaceProvider.discover(cwd);
  const packageDescriptor = workspace.packages.find((pkg) => pkg.name === packageName);

  if (!packageDescriptor) {
    throw new Error(`Package "${packageName}" was not found`);
  }

  const absoluteOutputDirectory = resolve(cwd, outputDirectory);

  const result = await executeProcess('pnpm', createPackArguments(absoluteOutputDirectory, args), {
    cwd: packageDescriptor.rootPath,
  });

  logger.success(ToolingTasks.pack.events.completed, {
    metadata: {
      command: result.command,
      stderr: result.stderr,
      stdout: result.stdout,
      exitCode: result.exitCode,
      durationMs: result.durationMs,
    },
  });

  return createProcessTaskResult(result);
}
