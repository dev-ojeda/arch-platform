// packages/core/src/domain/policy.ts

import type { Diagnostic } from './diagnostic.js';

export interface PolicyContext {
  workspaceRoot: string;
}

export interface Policy {
  id: string;

  description: string;

  evaluate(context: PolicyContext): Promise<Diagnostic[]>;
}
