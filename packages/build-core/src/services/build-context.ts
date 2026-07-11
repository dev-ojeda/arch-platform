// packages/build-core/src/services/build-context.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import type { ArtifactProvider } from '../artifact/artifact-provider.js';
import type { BuildExecutor } from '../executor/build-executor.js';
import type { Graph } from '../graph/dag-types.js';
import type { GraphQueryService } from '../graph/graph-query-services.js';
import type { ExecutionContractResolver } from '../planning/execution-contract-resolver.js';
import type { BuildState } from '../state/state-types.js';

export interface BuildContext {
  graph: Graph;
  query: GraphQueryService;
  contractResolver: ExecutionContractResolver;
  state: BuildState;
  executor: BuildExecutor;
  artifactCache: ArtifactCache;
  artifactProvider: ArtifactProvider;
  workspaceRoot: string;
}
