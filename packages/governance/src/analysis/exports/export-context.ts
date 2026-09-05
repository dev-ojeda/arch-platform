// packages/governance/src/analysis/exports/export-context.ts

import type { ExportedSymbol, SymbolNode } from '@arch-platform/code-analysis';
import type { PackageDescriptor } from '@arch-platform/platform-model';

export interface ExportContext {
  readonly exported: ExportedSymbol;

  readonly symbol: SymbolNode;

  readonly package: PackageDescriptor;
}
