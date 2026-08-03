// packages/code-analysis/src/language/typescript/typescript-source-symbol.ts

import type { Symbol } from 'ts-morph';

export function resolveSymbolId(symbol: Symbol | undefined): string | undefined {
  if (!symbol) {
    return undefined;
  }

  const declaration = symbol.getDeclarations()[0];

  if (!declaration) {
    return undefined;
  }

  return createSymbolId(declaration.getSourceFile().getFilePath(), symbol.getName());
}

/**
 * Symbol identity inside the analysis graph.
 *
 * Format:
 * normalized-source-file#symbol-name
 */
export function createSymbolId(sourceFile: string, name: string): string {
  return `${normalizePath(sourceFile)}#${name}`;
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/');
}
