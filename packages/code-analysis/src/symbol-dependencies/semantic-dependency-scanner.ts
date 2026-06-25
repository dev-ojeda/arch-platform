// packages/code-analysis/src/symbol-dependencies/semantic-dependency-scanner.ts
// packages/code-analysis/src/symbol-dependencies/semantic-dependency-scanner.ts

import type { Project } from 'ts-morph';

import { buildSymbolGraph } from '../symbol-graph/build-symbol-graph.js';
import type { SymbolGraph } from '../symbol-graph/symbol-graph-types.js';

export class SemanticDependencyScanner {
  scan(project: Project): SymbolGraph {
    return buildSymbolGraph(project);
  }
}
