// packages/code-analysis/src/symbols/references/symbol-reference-scanner.ts

import type { Project } from 'ts-morph';

import type { SymbolEdge } from '../model/symbol-edge-types.js';
import { resolveSymbolId } from '../symbol-id-resolver.js';

import { scanImportSymbolReferences } from './import-symbol-reference-scanner.js';

export function scanSymbolReferences(project: Project): readonly SymbolEdge[] {
  const edges: SymbolEdge[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    for (const declaration of sourceFile.getClasses()) {
      const from = `${sourceFile.getFilePath()}#${declaration.getName()}`;

      for (const property of declaration.getProperties()) {
        const type = property.getType();

        const symbol = type.getSymbol();

        if (!symbol) continue;

        const id = resolveSymbolId(symbol);

        if (!id) continue;

        edges.push({
          from,
          to: id,
          type: 'property-type',
        });
      }

      for (const method of declaration.getMethods()) {
        const returnType = method.getReturnType();

        const returnSymbol = returnType.getSymbol();

        if (!returnSymbol) continue;

        const id = resolveSymbolId(returnSymbol);

        if (!id) continue;

        if (returnSymbol) {
          edges.push({
            from,
            to: id,
            type: 'return-type',
          });
        }

        for (const parameter of method.getParameters()) {
          const parameterSymbol = parameter.getType().getSymbol();

          if (!parameterSymbol) continue;

          const id = resolveSymbolId(parameterSymbol);

          if (!id) continue;
          edges.push({
            from,
            to: id,
            type: 'parameter-type',
          });
        }
      }
    }
  }

  return [...edges, ...scanImportSymbolReferences(project)];
}
