// packages/code-analysis/src/symbols/graph/build-symbol-graph.ts

import type { Project } from 'ts-morph';

import type { PackageResolver } from '../../package/resolvers/package-resolver.js';
import { scanSymbolReferences } from '../references/symbol-reference-scanner.js';
import { scanSymbols } from '../scanners/scan-symbols.js';

import type { SymbolGraph } from './symbol-graph-types.js';

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
