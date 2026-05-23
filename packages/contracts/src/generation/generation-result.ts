// packages/contracts/src/generation/generation-result.ts

import type { GenerationReport } from '../reports/generation-report.js';

export interface GenerationResult {
  readonly success: boolean;

  readonly generatedFiles: readonly string[];

  readonly duration: number;

  readonly warnings: readonly string[];

  readonly report: GenerationReport;
}
