// packages/build-core/src/planning/execution-dag-compiler.ts

import type { GraphQueryService } from '../graph/graph-query-services.js';
import type { ExecutionContract } from '../runtime/execution/execution-contract.js';

import type { BuildPlan } from './build-plan.js';
import type { ExecutionContractResolver } from './execution-contract-resolver.js';
import type { ExecutionNode, ExecutionPlan } from './execution-dag.js';
import type { BuildPlanEntry } from './plan-entry.js';

type ExecutionDagCompilerInput = {
  plan: BuildPlan;
  scope: Set<string>;
};

export class ExecutionDagCompiler {
  constructor(
    private readonly query: GraphQueryService,
    private readonly contractResolver: ExecutionContractResolver,
  ) {}

  compile(input: ExecutionDagCompilerInput): ExecutionPlan {
    const { plan, scope } = input;

    const nodes = new Map<string, ExecutionNode>();

    // ---------------------------
    // 1. CREATE NODES
    // ---------------------------
    for (const name of scope) {
      const entry = plan.get(name);
      if (!entry) continue;
      const dependencies = this.resolveDependencies(name, scope);
      const contract = this.contractResolver.resolve(name);

      nodes.set(name, this.createNode(name, dependencies, entry, contract));
    }

    // ---------------------------
    // 2. LINK DEPENDENTS
    // ---------------------------
    for (const node of nodes.values()) {
      for (const dep of node.dependencies) {
        const depNode = nodes.get(dep);
        if (!depNode) continue;

        depNode.dependents.push(node.name);
      }
    }

    return { nodes };
  }

  private createNode(
    name: string,
    dependencies: string[],
    entry: BuildPlanEntry,
    contract: ExecutionContract,
  ): ExecutionNode {
    return {
      name,
      dependencies,
      dependents: [],
      shouldRun: entry.shouldExecute,
      contract,
    };
  }
  private resolveDependencies(name: string, scope: Set<string>): string[] {
    return this.query.getDependencies(name).filter((dep) => scope.has(dep));
  }
}
