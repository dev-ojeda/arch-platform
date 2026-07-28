// packages/code-analysis/src/analysis/analysis-context.ts

import type { Project } from 'ts-morph';

import type { ExportedSymbolIndex } from '../exports/exported-symbol-index.js';
import type { PackageDependencyGraph } from '../package/dependency/package-dependency-graph.js';
import type { SymbolGraph } from '../symbols/graph/symbol-graph-types.js';

export interface AnalysisContext {
  readonly project: Project;
  readonly symbolGraph: SymbolGraph;
  readonly packageGraph: PackageDependencyGraph;
  readonly exportedSymbols: ExportedSymbolIndex;
}
