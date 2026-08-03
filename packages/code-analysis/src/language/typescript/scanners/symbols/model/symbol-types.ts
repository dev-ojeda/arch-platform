// packages/code-analysis/src/language/typescript/scanners/symbols/model/symbol-types.ts

// packages/code-analysis/src/language/typescript/symbols/symbol-types.ts

export type SymbolKind = 'class' | 'interface' | 'function' | 'type' | 'enum' | 'variable';

export interface SymbolDefinition {
  readonly id: string;

  readonly name: string;

  readonly kind: SymbolKind;

  readonly sourceFile: string;
}
