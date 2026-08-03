// packages/code-analysis/src/language/typescript/model/import-declaration.ts

import type { ImportedSymbol } from '../scanners/symbols/model/imported-symbol.js';

export interface ImportDeclaration {
  readonly moduleSpecifier: string;

  readonly symbols: readonly ImportedSymbol[];
}
