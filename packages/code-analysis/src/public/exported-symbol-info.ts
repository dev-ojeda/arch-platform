// packages/code-analysis/src/public/exported-symbol-info.ts

import type { ExportKind } from '../api-surface/model/export-kind.js';

import type { ExportedSymbol } from './exported-symbol.js';

export interface ExportedSymbolInfo {
  readonly symbol: ExportedSymbol;

  readonly kind: ExportKind;

  readonly moduleSpecifier?: string;

  readonly isTypeOnly: boolean;
}
