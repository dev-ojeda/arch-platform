// packages/governance/src/diagnostics/type-only-import-diagnostics.ts

import type { ImportContext } from '../analysis/imports/import-context.js';
import type { SemanticIssue } from '../analysis/semantics/semantic-issue.js';

export function invalidTypeOnlyImport(context: ImportContext): SemanticIssue {
  return {
    code: 'ARCH_INVALID_TYPE_ONLY_IMPORT',
    severity: 'error',
    source: 'governance',
    symbolId: context.target.id,
    message: `Runtime symbol ${context.target.kind} "${context.target.name}" cannot be imported using "import type" .`,
    hint: 'Use a regular import instead.',
    location: {
      file: context.sourceFile,
    },
    metadata: {
      moduleSpecifier: context.moduleSpecifier,
      targetKind: context.target.kind,
    },
  };
}
