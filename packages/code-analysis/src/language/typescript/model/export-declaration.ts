// packages/code-analysis/src/language/typescript/model/export-declaration.ts

import type { ExportedSymbol } from '../scanners/symbols/model/exported-symbol.js';

export interface ExportedDeclaration {
  readonly moduleSpecifier?: string;

  readonly symbols: readonly ExportedSymbol[];
}
