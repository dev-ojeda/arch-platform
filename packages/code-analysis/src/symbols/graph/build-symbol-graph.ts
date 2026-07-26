// packages/code-analysis/src/symbols/graph/build-symbol-graph.ts


import { scanSymbolReferences } from '../references/symbol-reference-scanner.js';
import { scanSymbols } from '../scanners/scan-symbols.js';

import type { SymbolGraph } from './symbol-graph-types.js';
import type { PackageResolver } from '../../package/resolvers/package-resolver.js';
import type { Project } from 'ts-morph';

export function buildSymbolGraph(project: Project, packageResolver: PackageResolver): SymbolGraph {
  const definitions = scanSymbols(project);

  const nodes = definitions.map((symbol) => ({
    ...symbol,
    package: packageResolver.resolveFromFile(symbol.sourceFile) ?? 'unknown',
    exported: false,
  }));

  const edges = [...scanSymbolReferences(project)];

  return {
    nodes,
    edges,
  };
}
