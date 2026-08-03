// packages/code-analysis/src/language/typescript/model/method-declaration.ts

import type { ParameterDeclaration } from './parameter-declaration.js';
import type { TypeDeclaration } from './type-declaration.js';

export interface MethodDeclaration {
  readonly name: string;

  readonly parameters: readonly ParameterDeclaration[];

  readonly returnType: TypeDeclaration;
}
