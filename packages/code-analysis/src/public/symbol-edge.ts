// packages/code-analysis/src/public/symbol-edge.ts

import type { SymbolEdgeMetadata } from '../graph/symbol-edge-metadata.js';
import type { SymbolEdgeType } from '../graph/symbol-edge-type.js';

export interface SymbolEdge {
  readonly from: string;
  readonly to: string;
  readonly type: SymbolEdgeType;
  readonly metadata?: Readonly<SymbolEdgeMetadata>;
}
