// packages/code-analysis/src/symbols/symbol-id-resolver.ts

import type { Symbol } from 'ts-morph';

export function resolveSymbolId(symbol: Symbol): string | undefined {
  const declaration = symbol.getDeclarations()?.[0];

  if (!declaration) {
    return undefined;
  }

  const sourceFile = normalizePath(declaration.getSourceFile().getFilePath());

  return `${sourceFile}#${symbol.getName()}`;
}

export function normalizeSymbolId(sourceFile: string, name: string): string {
  return `${normalizePath(sourceFile)}#${name}`;
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/');
}
