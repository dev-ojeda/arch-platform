// packages/application/src/runtime/execution/events/runtime-execution-store.ts

import type { RuntimeExecution } from './runtime-execution.js';

export interface ExecutionStore {
  save(execution: RuntimeExecution): Promise<void>;

  get(executionId: string): Promise<RuntimeExecution | undefined>;

  list(): Promise<readonly RuntimeExecution[]>;
}
