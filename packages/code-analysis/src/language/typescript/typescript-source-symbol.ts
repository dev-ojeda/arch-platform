// packages/code-analysis/src/language/typescript/typescript-source-symbol.ts

import type { Symbol } from 'ts-morph';
import { Node } from 'ts-morph';

import type { SymbolKind } from '../../public/symbol-kind.js';

type ResolvedSourceKind = 'source' | 'declaration' | 'runtime' | 'unknown';

export function resolveSymbolId(symbol: Symbol | undefined): string | undefined {
  if (!symbol) {
    return undefined;
  }

  const resolved = symbol.getAliasedSymbol() ?? symbol;

  const declaration = resolved.getDeclarations()[0];

  if (!declaration) {
    return undefined;
  }

  return createSymbolId(declaration.getSourceFile().getFilePath(), resolved.getName());
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
export function resolveSymbolKind(symbol: Symbol | undefined): SymbolKind | undefined {
  if (!symbol) {
    return undefined;
  }

  const resolved = symbol.getAliasedSymbol() ?? symbol;
  const declaration = resolved.getDeclarations().find((node) => {
    return (
      Node.isVariableDeclaration(node) ||
      Node.isVariableStatement(node) ||
      Node.isClassDeclaration(node) ||
      Node.isFunctionDeclaration(node) ||
      Node.isEnumDeclaration(node) ||
      Node.isInterfaceDeclaration(node) ||
      Node.isTypeAliasDeclaration(node)
    );
  });

  if (!declaration) {
    return undefined;
  }

  if (Node.isClassDeclaration(declaration)) {
    return 'class';
  }

  if (Node.isInterfaceDeclaration(declaration)) {
    return 'interface';
  }

  if (Node.isFunctionDeclaration(declaration)) {
    return 'function';
  }

  if (Node.isEnumDeclaration(declaration)) {
    return 'enum';
  }

  if (Node.isTypeAliasDeclaration(declaration)) {
    return 'type';
  }

  if (Node.isVariableDeclaration(declaration)) {
    return 'variable';
  }

  return undefined;
}
export function resolveSourceKind(filePath: string): ResolvedSourceKind {
  const normalized = filePath.replace(/\\/g, '/').toLowerCase();

  if (normalized.endsWith('.d.ts')) {
    return 'declaration';
  }

  if (normalized.endsWith('.ts') || normalized.endsWith('.tsx')) {
    return 'source';
  }

  if (
    normalized.endsWith('.js') ||
    normalized.endsWith('.jsx') ||
    normalized.endsWith('.mjs') ||
    normalized.endsWith('.cjs')
  ) {
    return 'runtime';
  }

  return 'unknown';
}
