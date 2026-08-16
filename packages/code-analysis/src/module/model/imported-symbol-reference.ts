// packages/code-analysis/src/module/model/imported-symbol-reference.ts

export interface ImportedSymbolReference {
  readonly name: string;

  readonly symbolId?: string;

  readonly isTypeOnly: boolean;
}
