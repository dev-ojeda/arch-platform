// packages/code-analysis/src/symbol-graph/symbol-edge-types.ts

export type SymbolEdgeKind =
  | 'extends'
  | 'implements'
  | 'property-type'
  | 'parameter-type'
  | 'return-type';

export interface SymbolGraphEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: SymbolEdgeKind;
}
