// packages/code-analysis/src/exports/exported-symbol-index-builder.ts

import type { Project } from 'ts-morph';

import type { ExportedSymbolIndex } from './exported-symbol-index.js';

export interface ExportedSymbolIndexBuilder {
  build(project: Project): ExportedSymbolIndex;
}
