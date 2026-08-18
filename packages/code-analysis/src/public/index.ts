// packages/code-analysis/src/public/index.ts

export { DefaultPackageResolver } from '../package/index.js';
export type { PackageResolver } from '../package/index.js';
export type { AnalysisContext } from './analysis-context.js';
export { analyzeCode } from './analyze-code.js';
export type { ExportedSymbolIndex } from './exported-symbol-index.js';
export type { ExportedSymbolInfo } from './exported-symbol-info.js';
export type { ExportedSymbol } from './exported-symbol.js';
export type { SymbolEdge } from './symbol-edge.js';
export { SymbolGraphQuery } from './symbol-graph-query.js';
export type { SymbolGraph } from './symbol-graph.js';
export type { SymbolKind } from './symbol-kind.js';
export type { SymbolNode } from './symbol-node.js';
export type { RuntimeSymbolKind } from './symbol-runtime-kind.js';
