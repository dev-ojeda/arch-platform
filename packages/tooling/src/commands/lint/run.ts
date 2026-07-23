// packages/tooling/src/commands/lint/run.ts

import { pathExistsSync } from '@arch/infrastructure';

import { logger } from '../../logging/logger.js';
import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import type { LintCommandOptions } from '../common/command-options.js';
import { createSkippedCommandResult } from '../common/create-skipped-command-result.js';

import { createLintArguments } from './create-lint-arguments.js';

const DEFAULT_LINT_TARGETS = ['src', 'test', 'testing'] as const;

function resolveLintTargets(targets: readonly string[]): readonly string[] {
  return targets.filter(pathExistsSync);
}

function validateLintTargets(lintTargets: readonly string[]): ExecuteCommandResult | undefined {
  if (lintTargets.length === 0) {
    logger.warn(ToolingEvents.lint.skipped, {
      metadata: {
        reason: 'no-lint-targets',
      },
    });

    return createSkippedCommandResult(ToolingEvents.lint.skipped);
  }

  return undefined;
}

export async function runLintCommand(
  options: LintCommandOptions = {},
): Promise<ExecuteCommandResult> {
  const { args = [], targets = DEFAULT_LINT_TARGETS, maxWarnings = 0 } = options;

  const lintTargets = resolveLintTargets(targets);

  const skippedResult = validateLintTargets(lintTargets);

  if (skippedResult) {
    return skippedResult;
  }

  return executeProcess('eslint', createLintArguments(lintTargets, maxWarnings, args));
}
