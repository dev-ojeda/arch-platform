// packages/build-core/src/runtime/index.ts

export type { CommandOptions } from './command-options.js';
export type { CommandResult } from './command-result.js';
export {
  createExecutionContext,
  ExecutionPlanScheduler,
  updateExecutionState,
} from './execution/index.js';
export type {
  ExecutionCachePolicy,
  ExecutionCacheStrategy,
  ExecutionContext,
  ExecutionContract,
  ExecutionInputs,
  ExecutionNodeTrace,
  ExecutionOutputs,
  ExecutionRunDefinition,
  ExecutionState,
  ExecutionTrigger,
  ExecutionTriggerReason,
} from './execution/index.js';
