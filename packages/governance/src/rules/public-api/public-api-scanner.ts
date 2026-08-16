// packages/governance/src/rules/public-api/public-api-scanner.ts

import type { Diagnostic } from '@arch/platform-model';

import { ImportContextScanner } from '../../analysis/imports/import-context-scanner.js';
import type { GovernanceExecutionContext } from '../../context/governance-context.js';

import { PublicApiValidator } from './public-api-validator.js';

export class PublicApiScanner {
  constructor(
    private readonly importScanner = new ImportContextScanner(),
    private readonly validator = new PublicApiValidator(),
  ) {}

  scan(context: GovernanceExecutionContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    const analysisMap = new Map(
      context.analyses.map(({ packageName, analysis }) => [packageName, analysis]),
    );

    for (const importContext of this.importScanner.scan(context)) {
      const targetAnalysis = analysisMap.get(importContext.targetPackage.name);

      const diagnostic = this.validator.validateImport(
        importContext,
        targetAnalysis?.exportedSymbols,
      );

      if (diagnostic) {
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }
}
