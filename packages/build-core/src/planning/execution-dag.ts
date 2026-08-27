// packages/build-core/src/planning/execution-dag.ts

import type { ChangeReason } from '../cache/cache-types.js';
import type { ExecutionContract } from '../runtime/execution/execution-contract.js';

import type { BuildAction } from './plan-entry.js';

export interface ExecutionNode {
  name: string;

  dependencies: string[];
  dependents: string[];

  buildAction: BuildAction;

  /**
   * Reason why the ChangePlanner selected this node.
   */
  changeReason: ChangeReason;

  contract: ExecutionContract;
}

export type ExecutionPlan = {
  nodes: Map<string, ExecutionNode>;
};
