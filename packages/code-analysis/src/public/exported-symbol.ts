// packages/code-analysis/src/public/exported-symbol.ts

import type { ExportKind } from '../api-surface/model/export-kind.js';

import type { SymbolKind } from './symbol-kind.js';

export interface ExportedSymbol {
  readonly id: string;

  readonly exportedName: string;

  readonly localName: string;

  readonly symbolKind?: SymbolKind;

  readonly exportKind: ExportKind;

  readonly moduleSpecifier?: string;

  /**
   * True when this specific symbol is exported only in the type namespace.
   *
   * Example:
   * export type { Foo } from './foo.js';
   */
  readonly isTypeOnlyExport: boolean;
}
