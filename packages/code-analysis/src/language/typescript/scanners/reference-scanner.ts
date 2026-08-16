// packages/code-analysis/src/language/typescript/scanners/reference-scanner.ts

import type { SymbolEdge } from '../../../public/symbol-edge.js';
import type { SourceUnit } from '../source/source-unit.js';

export interface ReferenceScanner {
  scan(source: SourceUnit): readonly SymbolEdge[];
}
