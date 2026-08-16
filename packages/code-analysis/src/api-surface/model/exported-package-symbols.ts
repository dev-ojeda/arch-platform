// packages/code-analysis/src/api-surface/model/exported-package-symbols.ts

import type { ExportedSymbol } from '../../public/exported-symbol.js';

export interface ExportedPackageSymbols {
  readonly packageName: string;
  readonly symbols: readonly ExportedSymbol[];
}
