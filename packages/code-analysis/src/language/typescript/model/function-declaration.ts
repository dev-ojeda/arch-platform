// packages/code-analysis/src/language/typescript/model/function-declaration.ts

import type { ParameterDeclaration } from './parameter-declaration.js';
import type { TypeDeclaration } from './type-declaration.js';

export interface FunctionDeclaration {
  readonly symbolId: string;

  readonly name: string;

  readonly parameters: readonly ParameterDeclaration[];

  readonly returnType: TypeDeclaration;
}
