// packages/governance/src/public/compliance-scope.ts

import type { ComplianceEnvironment } from '@arch/platform-model';

export type ComplianceScope =
  | {
      kind: 'workspace';
      root: string;
      environment: ComplianceEnvironment;
    }
  | {
      kind: 'package';
      root: string;
      packageName: string;
      environment: ComplianceEnvironment;
    };
