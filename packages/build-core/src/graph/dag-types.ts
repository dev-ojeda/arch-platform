// packages/build-core/src/graph/dag-types.ts

import type { PackageBuildConfig } from '../package/package-config.js';

export type DagNode = {
  name: string;
  root: string;
  dependencies: string[];
  dependents: string[];
  outputs: string[];

  build?: PackageBuildConfig;
};
export type Graph = Map<string, DagNode>;
