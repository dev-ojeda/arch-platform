// packages/governance/src/analysis/exports/export-barrel-context.ts

import type { SymbolNode } from '@arch/code-analysis';
import type { PackageDescriptor } from '@arch/platform-model';

export type ExportSurface =
  | {
      readonly kind: 'public-barrel';
      readonly file: string;
    }
  | {
      readonly kind: 'entrypoint';
      readonly file: string;
    };

export interface ExportBarrelContext {
  readonly symbol: SymbolNode;
  readonly package: PackageDescriptor;
  readonly surface: ExportSurface;
}
