// packages/governance/src/analysis/imports/import-context-scanner.ts

import { SymbolGraphQuery } from '@arch/code-analysis';

import type { GovernanceExecutionContext } from '../../context/governance-execution-context.js';

import type { ImportContext } from './import-context.js';
import {
  resolveExternalImportTarget,
  resolveTargetPackage,
  resolveTargetPackageFromFile,
} from './import-target-resolver.js';

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
        const moduleSpecifier = edge.metadata?.moduleSpecifier;
        const resolvedFile = edge.metadata?.resolvedFile;

        // 1. El símbolo existe en el análisis actual.
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
            moduleSpecifier: typeof moduleSpecifier === 'string' ? moduleSpecifier : undefined,
          });

          continue;
        }

        // 2. Import que cruza package.
        let targetPackage;

        if (typeof moduleSpecifier === 'string') {
          targetPackage = resolveTargetPackage(moduleSpecifier, context.packages);
        }

        // 3. Relative import que cruza package.
        if (!targetPackage && typeof resolvedFile === 'string') {
          targetPackage = resolveTargetPackageFromFile(resolvedFile, context.packages);
        }

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
          moduleSpecifier: typeof moduleSpecifier === 'string' ? moduleSpecifier : undefined,
        });
      }
    }

    return importContexts;
  }
}
