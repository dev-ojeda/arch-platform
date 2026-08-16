// packages/code-analysis/src/language/typescript/model/export-declaration.ts

import type { ExportKind } from '../../../api-surface/model/export-kind.js';
import type { ExportedSymbol } from '../../../public/exported-symbol.js';

export interface ExportedDeclaration {
  readonly kind: ExportKind;

  readonly moduleSpecifier?: string;

  /**
   * Resolved source file of the exported module.
   *
   * Example:
   * export * from './public/index.js';
   *
   * resolvedFile:
   * src/public/index.ts
   */
  readonly resolvedFile?: string;

  /**
   * True when the whole export declaration uses `export type`.
   *
   * Example:
   * export type { Foo } from './foo.js';
   */
  readonly isTypeOnlyDeclaration: boolean;

  readonly symbols: readonly ExportedSymbol[];
}
