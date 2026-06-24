// packages/code-analysis/src/symbol-graph/build-symbol-graph.ts

import type { Project } from 'ts-morph';

import { scanSymbolReferences } from '../symbols/references/symbol-reference-scanner.js';
import { scanSymbols } from '../symbols/scan-symbols.js';

import type { SymbolGraph } from './symbol-graph-types.js';

export function buildSymbolGraph(project: Project): SymbolGraph {
  return {
    nodes: [...scanSymbols(project)],
    edges: [...scanSymbolReferences(project)],
  };
}
