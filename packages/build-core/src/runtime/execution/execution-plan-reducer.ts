// packages/build-core/src/runtime/execution/execution-plan-reducer.ts

import type { ExecutionPlan } from '../../planning/execution-dag.js';

export type ExecutionAction =
  | { type: 'START'; name: string }
  | { type: 'SUCCESS'; name: string }
  | { type: 'FAIL'; name: string }
  | { type: 'CACHE'; name: string }
  | { type: 'READY'; name: string };

export type ExecutionStateMap = Map<
  string,
  'pending' | 'ready' | 'running' | 'success' | 'failed' | 'cached'
>;

export class ExecutionPlanReducer {
  apply(plan: ExecutionPlan, state: ExecutionStateMap, action: ExecutionAction): ExecutionStateMap {
    const next = new Map(state);

    switch (action.type) {
      case 'READY':
        next.set(action.name, 'ready');
        break;

      case 'START':
        next.set(action.name, 'running');
        break;

      case 'SUCCESS':
        next.set(action.name, 'success');
        break;

      case 'FAIL':
        next.set(action.name, 'failed');
        break;

      case 'CACHE':
        next.set(action.name, 'cached');
        break;
    }

    return next;
  }
}
