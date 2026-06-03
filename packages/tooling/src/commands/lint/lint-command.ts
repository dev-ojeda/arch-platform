// packages/tooling/src/commands/lint/lint-command.ts

import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { executeCommand } from '../../runtime/execute-command.js';
import { createSkippedCommandResult } from '../../runtime/execution/create-skipped-command-result.js';
import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';
import { pathExists } from '../../runtime/filesystem/path-exists.js';
import { logger } from '../../utils/logger.js';

import { createLintArguments } from './create-lint-arguments.js';
import type { LintCommandOptions } from './lint-command-options.js';

const DEFAULT_LINT_TARGETS = ['src', 'test', 'testing'] as const;

function resolveLintTargets(targets: readonly string[]): readonly string[] {
  return targets.filter(pathExists);
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

  return executeCommand('eslint', createLintArguments(lintTargets, maxWarnings, args));
}
