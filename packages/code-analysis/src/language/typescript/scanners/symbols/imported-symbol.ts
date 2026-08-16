// packages/code-analysis/src/language/typescript/scanners/symbols/imported-symbol.ts

import type { SymbolKind } from '../../../../public/symbol-kind.js';

export interface ImportedSymbol {
  readonly name: string;

  readonly symbolId?: string;

  readonly kind?: SymbolKind;

  /**
   * True when the import declaration uses `import type`.
   */
  readonly isTypeOnlyImport: boolean;
}
