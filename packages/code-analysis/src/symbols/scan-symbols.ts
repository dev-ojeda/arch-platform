// packages/code-analysis/src/symbols/scan-symbols.ts

import type { Project } from 'ts-morph';

import { scanFunctions } from './function-scanner.js';
import { scanClasses } from './scan-classes.js';
import { scanInterfaces } from './scan-interfaces.js';
import type { SymbolDefinition } from './symbol-types.js';

export function scanSymbols(project: Project): readonly SymbolDefinition[] {
  const symbols: SymbolDefinition[] = [];

  for (const item of scanClasses(project)) {
    symbols.push({
      id: `${item.sourceFile}#${item.name}`,
      name: item.name,
      kind: 'class',
      sourceFile: item.sourceFile,
    });
  }

  for (const item of scanInterfaces(project)) {
    symbols.push({
      id: `${item.sourceFile}#${item.name}`,
      name: item.name,
      kind: 'interface',
      sourceFile: item.sourceFile,
    });
  }

  for (const item of scanFunctions(project)) {
    symbols.push({
      id: `${item.sourceFile}#${item.name}`,
      name: item.name,
      kind: 'function',
      sourceFile: item.sourceFile,
    });
  }

  return symbols;
}
