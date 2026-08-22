// packages/build-core/src/services/build-context.ts

import type { ArtifactCache, ArtifactProvider, Graph, OutputValidator } from '@arch/platform-model';

import type { BuildExecutor } from '../executor/build-executor.js';
import { GraphQueryService } from '../graph/graph-query-services.js';
import { DagHasher } from '../hash/dag-hasher.js';
import type { ExecutionContractResolver } from '../planning/execution-contract-resolver.js';
import type { BuildState } from '../state/state-types.js';
import { BuildStateWriter } from '../state/state-writer.js';

export interface BuildContext {
  graph: Graph;
  query: GraphQueryService;
  readonly dagHasher: DagHasher;
  contractResolver: ExecutionContractResolver;
  state: BuildState;
  executor: BuildExecutor;
  artifactCache: ArtifactCache;
  artifactProvider: ArtifactProvider;
  workspaceRoot: string;
  fsOutputValidator: OutputValidator;
  stateWriter: BuildStateWriter;
}
