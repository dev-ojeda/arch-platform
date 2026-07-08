// packages/build-core/test/helpers/execution-plan.ts

import type { BuildTaskRunner } from '../../src/graph/build-task-runner.js';
import type { ExecutionNode, ExecutionPlan } from '../../src/planning/execution-dag.js';
import { createExecutionContext } from '../../src/runtime/execution/execution-context.js';
import { ExecutionPlanScheduler } from '../../src/runtime/execution/execution-plan-scheduler.js';

export function createNode(
  name: string,
  options?: {
    dependencies?: string[];
    dependents?: string[];
  },
): ExecutionNode {
  return {
    name,

    dependencies: options?.dependencies ?? [],
    dependents: options?.dependents ?? [],

    buildAction: async () => {},

    contract: {
      id: name,

      inputs: {
        files: [],
        packages: [],
      },

      outputs: {
        files: [],
      },

      cache: {
        strategy: 'content-hash',
      },

      run: {
        executor: 'node',
      },
    },
  };
}
export function createPlan(...nodes: ExecutionNode[]): ExecutionPlan {
  return {
    nodes: new Map(nodes.map((node) => [node.name, node])),
  };
}

export function createScheduler(plan: ExecutionPlan, runner: BuildTaskRunner, concurrency = 1) {
  const context = createExecutionContext(plan);

  return {
    context,
    scheduler: new ExecutionPlanScheduler(runner, concurrency),
  };
}
