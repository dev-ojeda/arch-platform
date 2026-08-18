// packages/governance/src/diagnostics/private-export-barrel-diagnostics.ts

import type { ExportBarrelContext } from '../analysis/exports/export-barrel-context.js';
import type { ExportBarrelIssue } from '../analysis/exports/export-barrel-issue.js';

export function invalidPrivateBarrel(context: ExportBarrelContext): ExportBarrelIssue {
  const { surface } = context;

  const message =
    surface.kind === 'entrypoint'
      ? `Package entrypoint exports private symbol "${context.symbol.name}" ` +
        `from private source ${context.symbol.sourceFile}.`
      : `Public API exports symbol "${context.symbol.name}" ` +
        `from private source ${context.symbol.sourceFile}.`;

  const hint =
    surface.kind === 'entrypoint'
      ? 'Package entrypoint cannot export symbols from src/internal.'
      : 'Public API cannot export symbols from src/internal.';

  return {
    code: 'ARCH_PRIVATE_BARREL_EXPORT',
    severity: 'error',
    source: 'governance',

    symbolId: context.symbol.id,

    privateSource: context.symbol.sourceFile,

    surface,

    message,

    hint,

    location: {
      file: context.symbol.sourceFile,
    },

    metadata: {
      symbol: context.symbol.name,
      symbolKind: context.symbol.kind,
      surfaceKind: surface.kind,
      surfaceFile: surface.file,
      package: context.package.name,
    },
  };
}
