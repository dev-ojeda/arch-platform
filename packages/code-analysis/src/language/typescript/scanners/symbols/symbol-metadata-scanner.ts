// packages/code-analysis/src/language/typescript/scanners/symbols/symbol-metadata-scanner.ts

import type { SourceUnit } from '../../source/source-unit.js';

import type { SymbolDefinition } from './symbol-types.js';

export interface SymbolMetadataScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[];
}
