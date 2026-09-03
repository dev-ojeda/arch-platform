// packages/governance/src/public/compliance-result.ts

import type { Diagnostic } from '@arch/platform-model';

import type { ComplianceAction } from './compliance-action.js';
import type { ComplianceScope } from './compliance-scope.js';

export interface ComplianceResult {
  readonly success: boolean;
  readonly diagnostics: readonly Diagnostic[];
  readonly durationMs: number;
  readonly changes: number;
  readonly executions: number;
  readonly scope: ComplianceScope;
  readonly action: ComplianceAction;
}
