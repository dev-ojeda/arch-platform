// packages/build-core/src/runtime/execution/execution-context.ts
import type {
  ExecutionContext,
  ExecutionPlan,
  ExecutionState,
} from '../../planning/execution-dag.js';

export function createExecutionContext(plan: ExecutionPlan): ExecutionContext {
  const depsRemaining = new Map<string, number>();

  const state = new Map<string, ExecutionState>();

  for (const [name, node] of plan.nodes) {
    depsRemaining.set(name, node.dependencies.length);
    state.set(name, 'pending');
  }

  return {
    depsRemaining,
    state,
  };
}
