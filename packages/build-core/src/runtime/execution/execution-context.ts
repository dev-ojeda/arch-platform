// packages/build-core/src/runtime/execution/execution-context.ts
import type { ExecutionPlan } from '../../planning/execution-dag.js';

export type ExecutionState =
  | 'pending'
  | 'ready'
  | 'running'
  | 'success'
  | 'failed'
  | 'cached'
  | 'skipped';

export interface ExecutionContext {
  nodeStates: Map<string, ExecutionState>;
}
export function createExecutionContext(plan: ExecutionPlan): ExecutionContext {
  const nodeStates = new Map<string, ExecutionState>();

  for (const [name] of plan.nodes) {
    nodeStates.set(name, 'pending');
  }

  return {
    nodeStates,
  };
}
