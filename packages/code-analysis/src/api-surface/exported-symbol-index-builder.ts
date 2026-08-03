// packages/code-analysis/src/api-surface/exported-symbol-index-builder.ts

import type { SourceReader } from '../language/index.js';

import type { ExportedSymbolIndex } from './exported-symbol-index.js';

export interface ExportedSymbolIndexBuilder {
  build(sourceReader: SourceReader): ExportedSymbolIndex;
}
