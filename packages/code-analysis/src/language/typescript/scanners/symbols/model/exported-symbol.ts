// packages/code-analysis/src/language/typescript/scanners/symbols/model/exported-symbol.ts
export interface ExportedSymbol {
  readonly exportedName: string;
  readonly localName: string;
  readonly symbolId?: string;
}
