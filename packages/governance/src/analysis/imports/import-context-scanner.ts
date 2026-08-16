// packages/governance/src/analysis/imports/import-context-scanner.ts

import { SymbolGraphQuery } from '@arch/code-analysis';

import type { GovernanceExecutionContext } from '../../context/governance-context.js';

import type { ImportContext } from './import-context.js';
import { resolveExternalImportTarget, resolveTargetPackage } from './import-target-resolver.js';

export class ImportContextScanner {
  scan(context: GovernanceExecutionContext): readonly ImportContext[] {
    const importContexts: ImportContext[] = [];

    for (const { analysis, packageName } of context.analyses) {
      const query = new SymbolGraphQuery(analysis.symbolGraph);

      const sourcePackage = context.packages.get(packageName);

      if (!sourcePackage) {
        continue;
      }

      for (const edge of query.getImportEdges()) {
        //Local
        const localTarget = query.getNode(edge.to);

        if (localTarget) {
          const targetPackage = context.packages.get(localTarget.package);

          if (!targetPackage) {
            continue;
          }

          importContexts.push({
            edge,
            sourceFile: edge.from,
            target: localTarget,
            sourcePackage,
            targetPackage,
            moduleSpecifier:
              typeof edge.metadata?.moduleSpecifier === 'string'
                ? edge.metadata.moduleSpecifier
                : undefined,
          });

          continue;
        }

        // external
        const moduleSpecifier = edge.metadata?.moduleSpecifier;

        if (typeof moduleSpecifier !== 'string') {
          continue;
        }

        const targetPackage = resolveTargetPackage(moduleSpecifier, context.packages);

        if (!targetPackage) {
          continue;
        }

        const externalTarget = resolveExternalImportTarget(edge, targetPackage.name);

        if (!externalTarget) {
          continue;
        }

        importContexts.push({
          edge,
          sourceFile: edge.from,
          target: externalTarget,
          sourcePackage,
          targetPackage,
          moduleSpecifier,
        });
      }
    }

    return importContexts;
  }
}
