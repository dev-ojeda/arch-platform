// packages/code-analysis/src/language/typescript/scanners/symbols/symbol-metadata-scanner.ts

import type { SymbolDefinition } from './symbol-types.js';
import type { SourceUnit } from '../../source/source-unit.js';


export interface SymbolMetadataScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[];
}
