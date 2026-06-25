// packages/code-analysis/src/symbols/references/import-symbol-reference-scanner.ts

import type { Project } from 'ts-morph';

import type { SymbolEdge } from '../../symbol-graph/symbol-edge-types.js';

export function scanImportSymbolReferences(project: Project): readonly SymbolEdge[] {
  const edges: SymbolEdge[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    for (const declaration of sourceFile.getImportDeclarations()) {
      const namedImports = declaration.getNamedImports();

      for (const namedImport of namedImports) {
        const symbol = namedImport.getAliasNode()?.getSymbol();

        if (!symbol) continue;

        const from = sourceFile.getFilePath();

        edges.push({
          from,
          to: symbol.getFullyQualifiedName(),
          type: 'import',
        });
      }
    }
  }

  return edges;
}
