// packages/governance/src/diagnostics/private-export-barrel-diagnostics.ts

import type { ExportBarrelContext } from '../analysis/exports/export-barrel-context.js';
import type { ExportBarrelIssue } from '../analysis/exports/export-barrel-issue.js';

export function invalidPrivateBarrel(context: ExportBarrelContext): ExportBarrelIssue {
  return {
    code: 'ARCH_PRIVATE_BARREL_EXPORT',
    severity: 'error',
    source: 'governance',

    symbolId: context.symbol.id,

    publicBarrel: context.publicBarrel,
    privateSource: context.symbol.sourceFile,

    message:
      `Public API exports symbol "${context.symbol.name}" ` +
      `from private source ${context.symbol.sourceFile}.`,

    hint: 'Public API cannot export symbols from src/internal.',

    location: {
      file: context.symbol.sourceFile,
    },

    metadata: {
      symbol: context.symbol.name,
      symbolKind: context.symbol.kind,
      publicBarrel: context.publicBarrel,
      package: context.package.name,
    },
  };
}
