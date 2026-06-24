// packages/code-analysis/src/symbols/references/symbol-reference-scanner.ts

import type { Project } from 'ts-morph';

import type { SymbolGraphEdge } from '../../symbol-graph/symbol-edge-types.js';

export function scanSymbolReferences(project: Project): readonly SymbolGraphEdge[] {
  const edges: SymbolGraphEdge[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    for (const declaration of sourceFile.getClasses()) {
      const from = `${sourceFile.getFilePath()}#${declaration.getName()}`;

      for (const property of declaration.getProperties()) {
        const type = property.getType();

        const symbol = type.getSymbol();

        if (!symbol) continue;

        edges.push({
          from,
          to: symbol.getFullyQualifiedName(),
          kind: 'property-type',
        });
      }

      for (const method of declaration.getMethods()) {
        const returnType = method.getReturnType();

        const returnSymbol = returnType.getSymbol();

        if (returnSymbol) {
          edges.push({
            from,
            to: returnSymbol.getFullyQualifiedName(),
            kind: 'return-type',
          });
        }

        for (const parameter of method.getParameters()) {
          const parameterSymbol = parameter.getType().getSymbol();

          if (!parameterSymbol) continue;

          edges.push({
            from,
            to: parameterSymbol.getFullyQualifiedName(),
            kind: 'parameter-type',
          });
        }
      }
    }
  }

  return edges;
}
