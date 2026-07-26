// packages/code-analysis/src/symbols/index.ts

export { SymbolDependencyGraph } from './model/index.js';
export { scanImportSymbolReferences, scanSymbolReferences } from './references/index.js';
export { normalizeSymbolId, resolveSymbolId } from './symbol-id-resolver.js';
