// packages/code-analysis/src/public/analysis-context.ts

import type { ModuleDescriptor } from '../module/model/module-descriptor.js';
import type { PackageDependencyGraph } from '../package/dependency/package-dependency-graph.js';

import type { ExportedSymbolIndex } from './exported-symbol-index.js';
import type { SymbolGraph } from './symbol-graph.js';

export interface AnalysisContext {
  readonly symbolGraph: SymbolGraph;
  readonly packageGraph: PackageDependencyGraph;
  readonly exportedSymbols: ExportedSymbolIndex;
  readonly modules: readonly ModuleDescriptor[];
}
