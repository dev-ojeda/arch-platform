import type { ExportKind } from './export-kind.js';

// packages/code-analysis/src/api-surface/model/exported-symbol.ts
export interface ExportedSymbol {
  readonly id: string;

  readonly exportedName: string;

  readonly localName: string;

  readonly exportKind: ExportKind;

  readonly moduleSpecifier?: string;
}
