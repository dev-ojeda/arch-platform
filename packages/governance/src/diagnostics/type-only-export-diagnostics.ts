// packages/governance/src/diagnostics/type-only-export-diagnostics.ts

import type { ExportContext } from '../analysis/exports/export-context.js';
import type { SemanticIssue } from '../analysis/semantics/semantic-issue.js';

export function invalidTypeOnlyExport(context: ExportContext): SemanticIssue {
  return {
    code: 'ARCH_INVALID_TYPE_ONLY_EXPORT',
    severity: 'error',
    source: 'governance',

    symbolId: context.symbol.id,

    message: `Runtime symbol "${context.symbol.name}" (${context.symbol.kind}) cannot be exported using "export type".`,

    hint: `Use "export" instead of "export type" for ${context.symbol.name}.`,

    location: {
      file: context.symbol.sourceFile,
    },

    metadata: {
      symbol: context.symbol.name,
      symbolKind: context.symbol.kind,
      moduleSpecifier: context.exported.moduleSpecifier,
      package: context.package.name,
    },
  };
}
