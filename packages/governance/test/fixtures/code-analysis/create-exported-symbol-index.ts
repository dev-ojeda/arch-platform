// packages\governance\test\fixtures\code-analysis\create-exported-symbol-index.ts

import type { ExportedSymbolIndex } from '@arch/code-analysis';

export function createExportedSymbolIndex(
  overrides: Partial<ExportedSymbolIndex> = {},
): ExportedSymbolIndex {
  return {
    has: () => false,

    get: () => undefined,

    getAll: () => [],

    findPublicExport: () => [],

    isPublicExport: () => false,
    ...overrides,
  };
}
