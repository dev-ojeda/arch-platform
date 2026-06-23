// packages/code-analysis/src/graph/build-import-project-graph.ts

import type { Project } from 'ts-morph';

import { analyzeImports } from '../imports/import-analyzer.js';
import type { ImportReference } from '../imports/import-types.js';

import { buildImportGraph } from './build-import-graph.js';
import type { ProjectImportGraph } from './graph-types.js';

export function buildProjectImportGraph(project: Project): ProjectImportGraph {
  const imports: ImportReference[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    imports.push(...analyzeImports(sourceFile));
  }

  return buildImportGraph(imports);
}
