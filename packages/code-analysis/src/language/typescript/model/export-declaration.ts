// packages/code-analysis/src/language/typescript/model/export-declaration.ts

import type { ExportedSymbol } from '../../../api-surface/model/exported-symbol.js';

export interface ExportedDeclaration {
  readonly moduleSpecifier?: string;

  readonly symbols: readonly ExportedSymbol[];
}
