import type { ExportedSymbolIndex } from '@arch/code-analysis';

export function createExportedSymbolIndex(
  overrides: Partial<ExportedSymbolIndex> = {},
): ExportedSymbolIndex {
  return {
    has: () => false,
    get: () => undefined,
    ...overrides,
  };
}
