// packages/governance/src/analysis/exports/export-barrel-scanner.ts

import type { GovernanceExecutionContext } from '../../context/governance-context.js';

import type { ExportBarrelIssue } from './export-barrel-issue.js';

export interface ExportBarrelScanner {
  scan(context: GovernanceExecutionContext): readonly ExportBarrelIssue[];
}
