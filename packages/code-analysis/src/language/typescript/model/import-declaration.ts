// packages/code-analysis/src/language/typescript/model/import-declaration.ts

import type { ImportedSymbol } from '../scanners/symbols/imported-symbol.js';

export interface ImportDeclaration {
  readonly moduleSpecifier: string;
  readonly resolvedFile?: string;
  readonly isTypeOnly: boolean;
  readonly symbols: readonly ImportedSymbol[];
}
