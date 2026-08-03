// packages/code-analysis/src/api-surface/model/exported-symbol.ts
export interface ExportedSymbol {
  readonly id: string;

  readonly exportedName: string;

  readonly localName: string;
}
