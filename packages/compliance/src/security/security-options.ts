// packages/compliance/src/security/security-options.ts

import type { SecurityEnvironment } from '@arch-platform/platform-model';

export interface SecurityOptions {
  readonly workspaceRoot: string;
  readonly packageName?: string;
  readonly environment: SecurityEnvironment;
  readonly lockfilePath?: string;
}
