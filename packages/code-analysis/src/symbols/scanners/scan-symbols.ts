// packages/code-analysis/src/symbols/scanners/scan-symbols.ts


import { scanFunctions } from './function-scanner.js';
import { scanClasses } from './scan-classes.js';
import { scanInterfaces } from './scan-interfaces.js';

import type { SymbolDefinition } from '../model/symbol-types.js';
import type { Project } from 'ts-morph';

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
