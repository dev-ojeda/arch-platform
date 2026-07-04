// packages\build-core\src\planning\execution-plan.ts

import type { CacheDecision } from '../cache/cache-types.js';

export type ExecutionState = 'blocked' | 'ready' | 'cached';

export interface ExecutionNode {
  name: string;

  dependencies: string[];
  dependents: string[];

  cacheDecision: CacheDecision;

  shouldRun: boolean;

  depsRemaining: number;

  ready: boolean;
}

export interface ExecutionPlan {
  nodes: Map<string, ExecutionNode>;
}
