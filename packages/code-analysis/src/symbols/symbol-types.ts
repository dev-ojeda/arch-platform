// packages/code-analysis/src/symbols/symbol-types.ts

export type SymbolKind = 'class' | 'interface' | 'function' | 'type' | 'enum' | 'variable';

export interface SymbolDefinition {
  readonly id: string;

  readonly name: string;

  readonly kind: SymbolKind;

  readonly sourceFile: string;
}
