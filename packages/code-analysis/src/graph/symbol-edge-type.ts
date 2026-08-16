// packages/code-analysis/src/graph/symbol-edge-type.ts

export type SymbolEdgeType =
  | 'import'
  | 'export'
  | 'extends'
  | 'implements'
  | 'call'
  | 'type-reference'
  | 'property-type'
  | 'parameter-type'
  | 'return-type'
  | 'instanceof';
