// packages/code-analysis/src/language/typescript/model/class-declaration.ts

import type { MethodDeclaration } from './method-declaration.js';
import type { PropertyDeclaration } from './property-declaration.js';

export interface ClassDeclaration {
  readonly symbolId: string;

  readonly name: string;

  readonly methods: readonly MethodDeclaration[];

  readonly properties: readonly PropertyDeclaration[];
}
