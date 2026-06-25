// packages/code-analysis/src/symbol-graph/build-symbol-graph.ts

import type { Project } from 'ts-morph';

import { scanSymbolReferences } from '../symbols/references/symbol-reference-scanner.js';
import { scanSymbols } from '../symbols/scan-symbols.js';

import { resolvePackageName } from './package-name-resolver.js';
import type { SymbolGraph } from './symbol-graph-types.js';

export function buildSymbolGraph(project: Project): SymbolGraph {
  const definitions = scanSymbols(project);

  const nodes = definitions.map((symbol) => ({
    ...symbol,
    package: resolvePackageName(symbol.sourceFile) ?? 'unknown',
    exported: false,
  }));

  const edges = [...scanSymbolReferences(project)];

  return {
    nodes,
    edges,
  };
}
