// packages/governance/src/analysis/exports/export-context-scanner.ts

import { SymbolGraphQuery } from '@arch/code-analysis';

import type { GovernanceExecutionContext } from '../../context/governance-context.js';

import type { ExportContext } from './export-context.js';

export class ExportContextScanner {
  scan(context: GovernanceExecutionContext): readonly ExportContext[] {
    const contexts: ExportContext[] = [];

    const packageMap = new Map(context.workspace.packages.map((pkg) => [pkg.name, pkg]));

    for (const { packageName, analysis } of context.analyses) {
      const pkg = packageMap.get(packageName);

      if (!pkg) {
        continue;
      }

      const query = new SymbolGraphQuery(analysis.symbolGraph);

      for (const exported of analysis.exportedSymbols.getAll()) {
        const symbol = query.getNode(exported.id);

        if (!symbol) {
          continue;
        }

        contexts.push({
          exported,
          symbol,
          package: pkg,
        });
      }
    }

    return contexts;
  }
}
