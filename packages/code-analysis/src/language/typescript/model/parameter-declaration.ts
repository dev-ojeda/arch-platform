// packages/code-analysis/src/language/typescript/model/parameter-declaration.ts

import type { TypeDeclaration } from './type-declaration.js';

export interface ParameterDeclaration {
  readonly name: string;

  readonly type: TypeDeclaration;
}
