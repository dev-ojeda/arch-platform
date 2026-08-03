// packages/code-analysis/src/public/analysis-context.ts

import type { ExportedSymbolIndex } from '../api-surface/exported-symbol-index.js';
import type { SymbolGraph } from '../graph/symbol-graph-types.js';
import type { ModuleDescriptor } from '../module/model/module-descriptor.js';
import type { PackageDependencyGraph } from '../package/dependency/package-dependency-graph.js';

export interface AnalysisContext {
  readonly symbolGraph: SymbolGraph;
  readonly packageGraph: PackageDependencyGraph;
  readonly exportedSymbols: ExportedSymbolIndex;
  readonly modules: readonly ModuleDescriptor[];
}
