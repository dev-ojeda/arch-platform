// packages/code-analysis/src/exports/exported-symbol-index-builder.ts

import type { ExportedSymbolIndex } from './exported-symbol-index.js';
import type { Project } from 'ts-morph';


export interface ExportedSymbolIndexBuilder {
  build(project: Project): ExportedSymbolIndex;
}
