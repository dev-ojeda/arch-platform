// packages/code-analysis/src/symbols/scanners/function-scanner.ts

import type { FunctionMetadata } from './function-metadata.js';
import type { Project } from 'ts-morph';


export function scanFunctions(project: Project): readonly FunctionMetadata[] {
  const functions: FunctionMetadata[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    for (const fn of sourceFile.getFunctions()) {
      functions.push({
        name: fn.getName() ?? '<anonymous>',
        sourceFile: sourceFile.getFilePath(),

        parameters: fn.getParameters().map((parameter) => ({
          name: parameter.getName(),
          type: parameter.getType().getText(),
        })),

        returnType: fn.getReturnType().getText(),
      });
    }
  }

  return functions;
}
