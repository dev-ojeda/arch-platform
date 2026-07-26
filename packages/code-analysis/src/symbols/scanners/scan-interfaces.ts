// packages/code-analysis/src/symbols/scanners/scan-interfaces.ts

import type { InterfaceMetadata } from './interface-metadata.js';
import type { Project } from 'ts-morph';


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
