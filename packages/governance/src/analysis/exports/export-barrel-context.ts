// packages/governance/src/analysis/exports/export-barrel-context.ts

import type { SymbolNode } from '@arch/code-analysis';
import type { PackageDescriptor } from '@arch/platform-model';

export interface ExportBarrelContext {
  readonly symbol: SymbolNode;
  readonly package: PackageDescriptor;
  readonly publicBarrel: string;
}
