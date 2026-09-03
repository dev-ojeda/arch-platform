// packages/governance/src/public/compliance-options.ts

import type { ComplianceEnvironment } from '@arch/platform-model';

export interface ComplianceOptions {
  readonly workspaceRoot: string;
  readonly packageName?: string;
  readonly environment: ComplianceEnvironment;
}
