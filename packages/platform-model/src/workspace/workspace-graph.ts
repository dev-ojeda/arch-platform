// packages/platform-model/src/workspace/workspace-graph.ts

import type { PackageDescriptor } from '../package/package-descriptor.js';

export interface WorkspaceGraph {
  readonly nodes: Map<string, PackageDescriptor>;

  /**
   * key:
   *   workspace package
   *
   * value:
   *   internal dependencies
   */
  readonly edges: Map<string, readonly string[]>;
}
