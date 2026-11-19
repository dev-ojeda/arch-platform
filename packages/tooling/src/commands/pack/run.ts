// packages/tooling/src/commands/pack/run.ts

import {
  NodeWorkspaceProvider,
  resolvePath,
  NodeAsyncFileSystemAdapter,
} from '@arch-platform/infrastructure';

import { createPackArguments } from './create-pack-arguments.js';
import { preparePackageForPack } from './prepare-package-for-pack.js';
import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import { createProcessTaskResult } from '../../runtime/task/create-process-task-result.js';
import type { TaskProcessResult } from '../../runtime/task/task-process-result.js';
import type { PackCommandOptions } from '../common/command-options.js';

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
  const version = packageDescriptor.manifest.version;
  if (!version) {
    throw new Error(`Package "${packageName}" does not have a version`);
  }
  const packagePathSegments = packageDescriptor.name.split('/');
  const absoluteOutputDirectory = resolvePath(
    cwd,
    outputDirectory,
    ...packagePathSegments,
    version,
  );

  const stagingPath = await preparePackageForPack({
    workspaceRoot: workspace.root,
    packageRoot: packageDescriptor.rootPath,
  });

  const fsAdapter = new NodeAsyncFileSystemAdapter({ root: workspace.root });

  try {
    const result = await executeProcess(
      'pnpm',
      createPackArguments(absoluteOutputDirectory, args),
      { cwd: resolvePath(workspace.root, stagingPath) },
    );

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
  } finally {
    await fsAdapter.remove(stagingPath);
  }
}
