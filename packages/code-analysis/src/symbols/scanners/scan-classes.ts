// packages/code-analysis/src/symbols/scanners/scan-classes.ts

import type { ClassMetadata } from './class-metadata.js';
import type { Project } from 'ts-morph';


export function scanClasses(project: Project): readonly ClassMetadata[] {
  const classes: ClassMetadata[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    for (const declaration of sourceFile.getClasses()) {
      classes.push({
        name: declaration.getName() ?? '<anonymous>',

        sourceFile: sourceFile.getFilePath(),

        properties: declaration.getProperties().map((property) => ({
          name: property.getName(),
          type: property.getType().getText(),
        })),

        methods: declaration.getMethods().map((method) => ({
          name: method.getName(),
          returnType: method.getReturnType().getText(),
        })),
      });
    }
  }

  return classes;
}
