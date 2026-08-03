// packages/code-analysis/src/language/typescript/scanners/symbols/function-symbol-scanner.ts

import type { SourceUnit } from '../../source/source-unit.js';

import type { SymbolDefinition } from './model/symbol-types.js';

export class FunctionSymbolScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[] {
    return source.getFunctions().map((declaration) => ({
      id: declaration.symbolId,
      name: declaration.name,
      kind: 'function',
      sourceFile: source.path,
    }));
  }
}
