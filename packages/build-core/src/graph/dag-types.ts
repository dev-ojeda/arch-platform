// packages/build-core/src/graph/dag-types.ts

export type DagNode = {
  name: string;
  root: string;
  dependencies: string[]; // <- MUST be required
  dependents: string[];
  outputs: string[];
};

export type Graph = Map<string, DagNode>;
