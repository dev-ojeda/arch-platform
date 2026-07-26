// packages/build-core/src/planning/execution-dag.ts

import type { BuildAction } from './plan-entry.js';
import type { ExecutionContract } from '../runtime/execution/execution-contract.js';


export interface ExecutionNode {
  name: string;

  dependencies: string[];
  dependents: string[];

  buildAction: BuildAction;

  contract: ExecutionContract;
}
export type ExecutionPlan = {
  nodes: Map<string, ExecutionNode>;
};
