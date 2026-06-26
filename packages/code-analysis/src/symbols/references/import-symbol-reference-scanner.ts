// packages/code-analysis/src/symbols/references/import-symbol-reference-scanner.ts

import type { Project } from 'ts-morph';

import type { SymbolEdge } from '../../symbol-graph/symbol-edge-types.js';
import { resolveSymbolId } from '../../symbol-graph/symbol-id-resolver.js';

export function scanImportSymbolReferences(project: Project): readonly SymbolEdge[] {
  const edges: SymbolEdge[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    const imports = sourceFile.getImportDeclarations();

    const classes = sourceFile.getClasses();

    const fromNodes = classes.map((item) => ({
      id: `${sourceFile.getFilePath()}#${item.getName()}`,
    }));

    for (const declaration of imports) {
      const importPath = declaration.getModuleSpecifierValue();

      for (const namedImport of declaration.getNamedImports()) {
        const symbol = namedImport.getSymbol();

        if (!symbol) continue;

        const aliasedSymbol = symbol.getAliasedSymbol();

        if (!aliasedSymbol) continue;

        const to = resolveSymbolId(aliasedSymbol);

        if (!to) continue;

        for (const node of fromNodes) {
          edges.push({
            from: node.id,

            to,

            type: 'import',

            kind: 'import',

            importPath,
          });
        }
      }
    }
  }

  return edges;
}
