// packages/platform-model/src/security/security-scope.ts

import type { SecurityEnvironment } from './environment/security-environment.js';

export type SecurityScope =
  | {
      kind: 'workspace';
      root: string;
      environment: SecurityEnvironment;
    }
  | {
      kind: 'package';
      root: string;
      packageName: string;
      environment: SecurityEnvironment;
    };
