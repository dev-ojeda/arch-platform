// packages/code-analysis/src/symbols/symbol-types.ts

export type SymbolKind = 'class' | 'interface' | 'function' | 'type' | 'enum' | 'variable';

export interface SymbolDefinition {
  readonly id: string;
  readonly name: string;
  readonly kind: SymbolKind;
  readonly sourceFile: string;
}

export interface SymbolNode {
  id: string;

  name: string;

  kind: SymbolKind;

  package: string;

  file: string;

  exported: boolean;
}

export interface SymbolUsage {
  fromPackage: string;

  fromFile: string;

  toPackage: string;

  symbol: string;

  kind: SymbolKind;

  usage: 'import' | 'extends' | 'implements' | 'call' | 'type-reference' | 'instanceof';
}

export interface SymbolGraph {
  symbols: SymbolNode[];

  usages: SymbolUsage[];
}
