// packages/code-analysis/src/symbol-graph/symbol-id-resolver.ts

import type { Symbol } from 'ts-morph';

export function resolveSymbolId(symbol: Symbol): string | undefined {
  const declaration = symbol.getDeclarations()?.[0];

  if (!declaration) {
    return undefined;
  }

  const sourceFile = declaration.getSourceFile().getFilePath();

  const name = symbol.getName();

  return `${normalizePath(sourceFile)}#${name}`;
}

function normalizePath(value: string) {
  return value.replace(/\\/g, '/');
}
