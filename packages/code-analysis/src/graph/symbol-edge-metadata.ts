// packages/code-analysis/src/graph/symbol-edge-metadata.ts

import type { SymbolKind } from '../public/symbol-kind.js';

export interface SymbolEdgeMetadata {
  readonly kind?: SymbolKind;
  readonly isTypeOnly?: boolean;
  readonly moduleSpecifier?: string;
  readonly targetPackage?: string;
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
}
