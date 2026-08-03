// packages/tooling/src/commands/lint/run.ts

import { pathExistsSync } from '@arch/infrastructure';

import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import { createProcessTaskResult } from '../../runtime/task/create-process-task-result.js';
import type { TaskProcessResult } from '../../runtime/task/task-process-result.js';
import type { LintCommandOptions } from '../common/command-options.js';
import { createSkippedCommandResult } from '../common/create-skipped-command-result.js';

import { createLintArguments } from './create-lint-arguments.js';

const DEFAULT_LINT_TARGETS = ['src', 'test', 'testing'] as const;

function resolveLintTargets(targets: readonly string[]): readonly string[] {
  return targets.filter(pathExistsSync);
}

function validateLintTargets(lintTargets: readonly string[]): TaskProcessResult | undefined {
  if (lintTargets.length === 0) {
    logger.warn(ToolingTasks.lint.events.skipped, {
      metadata: {
        reason: 'no-lint-targets',
      },
    });

    return createSkippedCommandResult();
  }

  return undefined;
}

export async function runLintCommand(options: LintCommandOptions = {}): Promise<TaskProcessResult> {
  const { args = [], targets = DEFAULT_LINT_TARGETS, maxWarnings = 0 } = options;

  const lintTargets = resolveLintTargets(targets);

  const skippedResult = validateLintTargets(lintTargets);

  if (skippedResult) {
    return skippedResult;
  }
  const result = await executeProcess(
    'eslint',
    createLintArguments(lintTargets, maxWarnings, args),
  );
  return createProcessTaskResult(result);
}
