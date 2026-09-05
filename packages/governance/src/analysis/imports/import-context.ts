// packages/governance/src/analysis/imports/import-context.ts

import type { SymbolEdge, SymbolNode } from '@arch-platform/code-analysis';
import type { PackageDescriptor } from '@arch-platform/platform-model';

export interface ImportContext {
  readonly edge: SymbolEdge;

  /**
   * File containing the import declaration.
   */
  readonly sourceFile: string;

  /**
   * Imported symbol.
   */
  readonly target: SymbolNode;

  readonly sourcePackage: PackageDescriptor;
  readonly targetPackage: PackageDescriptor;

  readonly moduleSpecifier?: string;
}
