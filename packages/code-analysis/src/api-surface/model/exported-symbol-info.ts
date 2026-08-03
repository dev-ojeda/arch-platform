// packages/code-analysis/src/api-surface/model/exported-symbol-info.ts

import type { ExportKind } from './export-kind.js';
import type { ExportedSymbol } from './exported-symbol.js';

export interface ExportedSymbolInfo {
  readonly symbol: ExportedSymbol;

  readonly kind: ExportKind;

  readonly moduleSpecifier?: string;
}
