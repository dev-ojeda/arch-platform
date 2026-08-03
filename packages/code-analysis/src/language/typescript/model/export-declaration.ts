// packages/code-analysis/src/language/typescript/model/export-declaration.ts

import type { ExportKind } from '../../../api-surface/model/export-kind.js';
import type { ExportedSymbol } from '../../../api-surface/model/exported-symbol.js';

export interface ExportedDeclaration {
  readonly kind: ExportKind;

  readonly moduleSpecifier?: string;

  readonly symbols: readonly ExportedSymbol[];
}
