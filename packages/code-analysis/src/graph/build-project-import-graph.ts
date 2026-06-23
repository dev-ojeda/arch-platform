// packages/code-analysis/src/graph/build-project-import-graph.ts

import type { Project } from 'ts-morph';

import { analyzeImports } from '../imports/import-analyzer.js';

import { buildDependencyGraph } from './dependency-graph-builder.js';

export function buildProjectImportGraph(project: Project) {
  const imports = [];

  for (const sourceFile of project.getSourceFiles()) {
    imports.push(...analyzeImports(sourceFile));
  }

  return buildDependencyGraph(imports);
}
