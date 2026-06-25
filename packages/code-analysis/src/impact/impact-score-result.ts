// packages/code-analysis/src/impact/impact-score-result.ts

export type ImpactRisk = 'low' | 'medium' | 'high' | 'critical';

export interface ImpactScoreResult {
  symbolId: string;

  score: number;

  risk: ImpactRisk;

  affectedSymbols: number;

  affectedPackages: number;

  affectedFiles: number;

  depth: number;
}
