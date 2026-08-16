// packages/code-analysis/src/language/typescript/scanners/symbols/variable-symbol-scanner.ts

import type { SourceUnit } from '../../source/source-unit.js';

import type { SymbolDefinition } from './symbol-types.js';

export class VariableSymbolScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[] {
    return source.getVariables().map((declaration) => ({
      id: declaration.symbolId,
      name: declaration.name,
      kind: 'variable',
      sourceFile: source.path,
    }));
  }
}
