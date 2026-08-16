// packages\governance\test\fixtures\code-analysis\create-analysis-context.ts

import type { AnalysisContext } from '@arch/code-analysis';

import { createSymbolGraph } from '../graph/create-empty-symbol-graph.js';

import { createExportedSymbolIndex } from './create-exported-symbol-index.js';

export function createAnalysisContext(overrides: Partial<AnalysisContext> = {}): AnalysisContext {
  return {
    symbolGraph: createSymbolGraph(),
    packageGraph: {
      dependencies: [],
    },
    exportedSymbols: createExportedSymbolIndex(),
    modules: [],
    ...overrides,
  };
}
