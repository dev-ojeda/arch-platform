// packages/application/src/runtime/execution/index.ts

export type { RuntimeExecutionContext } from './context/index.js';
export {
  InMemoryRuntimeEventBus,
  publishGenerationEvent,
  RuntimeEventTypes,
} from './events/index.js';
export type {
  BaseRuntimeEvent,
  ExecutionStore,
  PipelineCompletedEvent,
  PipelineEvent,
  PipelineFailedEvent,
  PipelineStartedEvent,
  RuntimeEvent,
  RuntimeEventBus,
  RuntimeEventListener,
  RuntimeEventType,
  RuntimeExecution,
  StepCancelledEvent,
  StepCompletedEvent,
  StepEvent,
  StepFailedEvent,
  StepRetryEvent,
  StepStartedEvent,
} from './events/index.js';
export { RuntimeExecutionStore } from './runtime-execution-store.js';
export { EXECUTION_STATUS } from './status/index.js';
export type { ExecutionStatus } from './status/index.js';
export { TimelineAggregator, TimelineConsoleRenderer } from './timeline/index.js';
export type { ExecutionTimeline, ExecutionTimelineStep } from './timeline/index.js';

export type {
  ExecutionListener,
  ExecutionState,
  RuntimeExecutionStatus,
  StepState,
} from './runtime-execution-status.js';

export { RuntimeExecutionStatuses } from './runtime-execution-status.js';

// Nota: Eliminamos la línea conflictiva "export { type RuntimeExecution }"
// para prevenir la duplicación estática ya resuelta por los submódulos.
