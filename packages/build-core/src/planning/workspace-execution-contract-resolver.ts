// packages/build-core/src/planning/workspace-execution-contract-resolver.ts

import type { GraphQueryService } from '../graph/graph-query-services.js';
import type { ExecutionContract } from '../runtime/execution/execution-contract.js';

export class WorkspaceExecutionContractResolver {
  constructor(private readonly query: GraphQueryService) {}

  resolve(name: string): ExecutionContract {
    const node = this.query.getNode(name);

    return {
      id: name,

      inputs: {
        packages: node.dependencies,
        files: [],
        env: undefined,
      },

      outputs: {
        files: [],
      },

      cache: {
        strategy: 'content-hash',
        key: undefined,
      },

      run: {
        executor: 'custom',
        command: undefined,
      },
    };
  }
}
