// packages/platform-model/src/graph/graph.ts

import type { DagNode, MutableDagNode } from './dag-types.js';

export type Graph = ReadonlyMap<string, DagNode>;
export type MutableGraph = Map<string, MutableDagNode>;
