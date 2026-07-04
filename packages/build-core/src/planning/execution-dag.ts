// packages/build-core/src/planning/execution-dag.ts

import type { CacheDecision } from '../cache/cache-types.js';

export type ExecutionState = 'pending' | 'ready' | 'running' | 'success' | 'failed' | 'cached';

export type ExecutionContext = {
  depsRemaining: Map<string, number>;
  state: Map<string, ExecutionState>;
};

export interface ExecutionNode {
  name: string;
  dependencies: string[];
  dependents: string[];
  cacheDecision: CacheDecision;
  shouldRun: boolean;
}
export type ExecutionPlan = {
  nodes: Map<string, ExecutionNode>;
};
