// packages/governance/src/analysis/exports/export-barrel-issue.ts

import type { Diagnostic } from '@arch/platform-model';

export interface ExportBarrelIssue extends Diagnostic {
  readonly symbolId: string;
  readonly publicBarrel: string;
  readonly privateSource: string;
}
