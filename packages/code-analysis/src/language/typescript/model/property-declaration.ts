// packages/code-analysis/src/language/typescript/model/property-declaration.ts

import type { TypeDeclaration } from './type-declaration.js';

export interface PropertyDeclaration {
  readonly name: string;

  readonly type: TypeDeclaration;
}
