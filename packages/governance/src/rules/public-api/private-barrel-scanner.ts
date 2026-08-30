// packages/governance/src/rules/public-api/private-barrel-scanner.ts

import { SymbolGraphQuery } from '@arch/code-analysis';

import type { ExportBarrelIssue } from '../../analysis/exports/export-barrel-issue.js';
import type { ExportBarrelScanner } from '../../analysis/exports/export-barrel-scanner.js';
import type { GovernanceExecutionContext } from '../../context/governance-execution-context.js';
import { invalidPrivateBarrel } from '../../diagnostics/private-export-barrel-diagnostics.js';
import { ArchitectureSourceDetector } from '../architecture/architecture-source-detector.js';

export class PrivateBarrelScanner implements ExportBarrelScanner {
  constructor(private readonly architectureSourceDetector = new ArchitectureSourceDetector()) {}

  scan(context: GovernanceExecutionContext): readonly ExportBarrelIssue[] {
    const diagnostics: ExportBarrelIssue[] = [];

    const packageMap = new Map(context.workspace.packages.map((pkg) => [pkg.name, pkg]));

    for (const packageContext of context.analyses) {
      const pkg = packageMap.get(packageContext.packageName);

      if (!pkg) {
        continue;
      }

      const query = new SymbolGraphQuery(packageContext.analysis.symbolGraph);

      for (const edge of query.getExportEdges()) {
        const resolvedFile = edge.metadata?.resolvedFile;

        if (!resolvedFile) {
          continue;
        }

        const surface = this.architectureSourceDetector.isPublicBarrel(resolvedFile)
          ? {
              kind: 'public-barrel' as const,
              file: resolvedFile,
            }
          : this.architectureSourceDetector.isPackageEntrypoint(edge.from)
            ? {
                kind: 'entrypoint' as const,
                file: edge.from,
              }
            : undefined;

        if (!surface) {
          continue;
        }

        const privateSource = edge.to.slice(0, edge.to.lastIndexOf('#'));

        if (!this.architectureSourceDetector.isPrivateSource(privateSource)) {
          continue;
        }

        const symbol = query.getNode(edge.to);

        if (!symbol) {
          continue;
        }

        diagnostics.push(
          invalidPrivateBarrel({
            symbol,
            package: pkg,
            surface,
          }),
        );
      }
    }

    return diagnostics;
  }
}
