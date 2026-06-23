// packages/governance/src/types/top-level-result.ts

export type TopoLevelsResult = {
  levels: string[][];
  hasCycles: boolean;
  unresolvedNodes?: string[];
};
