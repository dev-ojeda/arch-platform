// packages/governance/src/types/workspace-graph.ts

import type { ResolvedPackage } from './governance-context.js';

export type WorkspaceGraph = {
  nodes: Map<string, ResolvedPackage>;
};
