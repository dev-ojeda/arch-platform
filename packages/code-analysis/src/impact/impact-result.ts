// packages/code-analysis/src/impact/impact-result.ts

export interface ImpactResult {
  symbolId: string;

  affectedSymbols: string[];

  affectedPackages: string[];

  affectedFiles: string[];

  depth: number;
}
