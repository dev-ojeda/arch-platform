// packages/platform-model/src/conventions/convention-definition.ts
import type { ConventionType } from './convention-type.js';

export interface ConventionDefinition {
  id: string;

  type: ConventionType;

  rules: Record<string, unknown>;
}
