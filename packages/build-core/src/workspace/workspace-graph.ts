// packages/build-core/src/workspace/workspace-graph.ts

import type { WorkspaceGraphNode } from './workspace-graph-node.js';

export interface WorkspaceGraph {
  readonly nodes: Map<string, WorkspaceGraphNode>;

  /**
   * key:
   *   workspace package
   *
   * value:
   *   internal dependencies
   */
  readonly edges: Map<string, readonly string[]>;
}
