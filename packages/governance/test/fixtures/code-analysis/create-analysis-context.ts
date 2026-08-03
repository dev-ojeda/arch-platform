import type { AnalysisContext } from '@arch/code-analysis';

import { createExportedSymbolIndex } from './create-exported-symbol-index.js';

export function createAnalysisContext(overrides: Partial<AnalysisContext> = {}): AnalysisContext {
  return {
    symbolGraph: {
      nodes: [],
      edges: [],
    },
    packageGraph: {
      dependencies: [],
    },
    exportedSymbols: createExportedSymbolIndex(),
    modules: [],
    ...overrides,
  };
}
