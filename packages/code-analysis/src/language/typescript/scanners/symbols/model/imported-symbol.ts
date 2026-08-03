// packages/code-analysis/src/language/typescript/scanners/symbols/model/imported-symbol.ts

export interface ImportedSymbol {
  readonly name: string;
  readonly symbolId?: string;
}
