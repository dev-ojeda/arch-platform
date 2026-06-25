// packages/code-analysis/src/symbol-graph/symbol-edge-types.ts

export type SymbolEdgeType =
  | 'import'
  | 'extends'
  | 'implements'
  | 'call'
  | 'type-reference'
  | 'property-type'
  | 'parameter-type'
  | 'return-type'
  | 'instanceof';

export interface SymbolEdge {
  readonly from: string;

  readonly to: string;

  readonly type: SymbolEdgeType;
}
