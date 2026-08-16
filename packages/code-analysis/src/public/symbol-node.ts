// packages/code-analysis/src/public/symbol-node.ts

import type { SymbolDefinition } from '../language/typescript/scanners/symbols/symbol-types.js';

export interface SymbolNode extends SymbolDefinition {
  readonly package: string;
}
