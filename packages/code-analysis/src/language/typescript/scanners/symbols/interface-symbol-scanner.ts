// packages/code-analysis/src/language/typescript/scanners/symbols/interface-symbol-scanner.ts

import type { SourceUnit } from '../../source/source-unit.js';

import type { SymbolDefinition } from './model/symbol-types.js';

export class InterfaceSymbolScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[] {
    return source.getInterfaces().map((declaration) => ({
      id: declaration.symbolId,
      name: declaration.name,
      kind: 'interface',
      sourceFile: source.path,
    }));
  }
}
