// packages/governance/src/analysis/exports/export-barrel-issue.ts

import type { Diagnostic } from '@arch/platform-model';

import type { ExportSurface } from './export-barrel-context.js';

export interface ExportBarrelIssue extends Diagnostic {
  readonly symbolId: string;
  readonly privateSource: string;
  readonly surface: ExportSurface;
}
