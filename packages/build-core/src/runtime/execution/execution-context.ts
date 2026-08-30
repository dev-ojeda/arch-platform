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

export type ExecutionTriggerReason =
  | 'dependency-changed'
  | 'source-changed'
  | 'first-build'
  | 'manual'
  | 'cache-invalidated';

export type ExecutionTrigger = {
  package: string;
  reason: ExecutionTriggerReason;
};

export interface ExecutionNodeTrace {
  state: ExecutionState;

  startedAt?: number;

  finishedAt?: number;

  duration?: number;

  trigger?: ExecutionTrigger;

  error?: string;
}

export interface ExecutionContext {
  nodes: Map<string, ExecutionNodeTrace>;

  /**
   * Legacy compatibility.
   */
  nodeStates: Map<string, ExecutionState>;

  triggers: Map<string, ExecutionTrigger>;
}

export function createExecutionContext(plan: ExecutionPlan): ExecutionContext {
  const nodes = new Map<string, ExecutionNodeTrace>();
  const nodeStates = new Map<string, ExecutionState>();
  const triggers = new Map<string, ExecutionTrigger>();

  for (const [name] of plan.nodes) {
    nodes.set(name, {
      state: 'pending',
    });

    nodeStates.set(name, 'pending');
  }

  return {
    nodes,
    nodeStates,
    triggers,
  };
}
export function updateExecutionState(
  ctx: ExecutionContext,
  name: string,
  state: ExecutionState,
  error?: string,
): void {
  const current = ctx.nodes.get(name);

  if (!current) {
    throw new Error(`Execution node not found: ${name}`);
  }

  const now = Date.now();

  const updated: ExecutionNodeTrace = {
    ...current,
    state,
  };

  if (state === 'running') {
    updated.startedAt = now;
  }

  if (state === 'success' || state === 'failed' || state === 'cached' || state === 'skipped') {
    updated.finishedAt = now;

    if (updated.startedAt !== undefined) {
      updated.duration = updated.finishedAt - updated.startedAt;
    }
  }

  if (error) {
    updated.error = error;
  }

  ctx.nodes.set(name, updated);

  ctx.nodeStates.set(name, state);
}
