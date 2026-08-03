// packages/code-analysis/src/language/typescript/model/interface-declaration.ts

import type { PropertyDeclaration } from './property-declaration.js';

export interface InterfaceDeclaration {
  readonly symbolId: string;

  readonly name: string;

  readonly properties: readonly PropertyDeclaration[];
}
