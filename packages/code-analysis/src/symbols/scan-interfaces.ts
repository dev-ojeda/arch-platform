// packages/code-analysis/src/symbols/scan-interfaces.ts

import type { Project } from 'ts-morph';

import type { InterfaceMetadata } from './interface-metadata.js';

export function scanInterfaces(project: Project): readonly InterfaceMetadata[] {
  const interfaces: InterfaceMetadata[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    for (const declaration of sourceFile.getInterfaces()) {
      interfaces.push({
        name: declaration.getName(),

        sourceFile: sourceFile.getFilePath(),

        properties: declaration.getProperties().map((property) => ({
          name: property.getName(),
          type: property.getType().getText(),
        })),
      });
    }
  }

  return interfaces;
}
