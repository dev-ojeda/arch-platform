// packages/code-analysis/src/impact/impact-score-calculator.ts

import type { ImpactResult } from './impact-result.js';
import type { ImpactRisk, ImpactScoreResult } from './impact-score-result.js';

export class ImpactScoreCalculator {
  calculate(impact: ImpactResult): ImpactScoreResult {
    const score =
      impact.affectedSymbols.length * 1 +
      impact.affectedPackages.length * 3 +
      impact.affectedFiles.length * 0.5 +
      impact.depth * 2;

    return {
      symbolId: impact.symbolId,

      score,

      risk: this.resolveRisk(score),

      affectedSymbols: impact.affectedSymbols.length,

      affectedPackages: impact.affectedPackages.length,

      affectedFiles: impact.affectedFiles.length,

      depth: impact.depth,
    };
  }

  private resolveRisk(score: number): ImpactRisk {
    if (score >= 20) {
      return 'critical';
    }

    if (score >= 10) {
      return 'high';
    }

    if (score >= 5) {
      return 'medium';
    }

    return 'low';
  }
}
