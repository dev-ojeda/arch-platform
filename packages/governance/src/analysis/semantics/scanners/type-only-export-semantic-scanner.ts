// packages/governance/src/analysis/semantics/scanners/type-only-export-semantic-scanner.ts

import type { GovernanceExecutionContext } from '../../../context/governance-context.js';
import { invalidTypeOnlyExport } from '../../../diagnostics/type-only-export-diagnostics.js';
import { ExportContextScanner } from '../../exports/export-context-scanner.js';
import type { SemanticIssue } from '../semantic-issue.js';
import { isRuntimeSymbolKind } from '../semantic-kind.js';
import type { SemanticScanner } from '../semantic-scanner.js';

export class TypeOnlyExportSemanticScanner implements SemanticScanner {
  constructor(private readonly exportScanner = new ExportContextScanner()) {}
  scan(context: GovernanceExecutionContext): SemanticIssue[] {
    const issues: SemanticIssue[] = [];
    const exportContexts = this.exportScanner.scan(context);
    for (const exportContext of exportContexts) {
      if (
        exportContext.exported.isTypeOnlyExport &&
        isRuntimeSymbolKind(exportContext.symbol.kind)
      ) {
        issues.push(invalidTypeOnlyExport(exportContext));
      }
    }

    return issues;
  }
}
