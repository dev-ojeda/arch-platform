// packages/tooling/src/commands/builder/build-task-result.ts

import type { BuildServiceSummary } from '@arch/build-core';

import type { TaskResult } from '../../runtime/task/task-result.js';

export interface BuildTaskResult extends TaskResult {
  readonly summary: BuildServiceSummary;
}
