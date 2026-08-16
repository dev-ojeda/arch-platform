// packages/governance/src/analysis/semantics/scanners/type-only-import-semantic-scanner.ts

import type { GovernanceExecutionContext } from '../../../context/governance-context.js';
import { invalidTypeOnlyImport } from '../../../diagnostics/type-only-import-diagnostics.js';
import { ImportContextScanner } from '../../imports/import-context-scanner.js';
import type { SemanticIssue } from '../semantic-issue.js';
import { isRuntimeSymbolKind } from '../semantic-kind.js';
import type { SemanticScanner } from '../semantic-scanner.js';

export class TypeOnlyImportSemanticScanner implements SemanticScanner {
  constructor(private readonly importScanner = new ImportContextScanner()) {}

  scan(context: GovernanceExecutionContext): SemanticIssue[] {
    const issues: SemanticIssue[] = [];
    const importContexts = this.importScanner.scan(context);

    for (const importContext of importContexts) {
      if (
        importContext.edge.metadata?.isTypeOnly &&
        isRuntimeSymbolKind(importContext.target.kind)
      ) {
        issues.push(invalidTypeOnlyImport(importContext));
      }
    }

    return issues;
  }
}
