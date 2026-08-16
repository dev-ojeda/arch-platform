// packages/governance/src/rules/package-dependency/package-dependency-scanner.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../../context/governance-context.js';

export class PackageDependencyScanner {
  constructor(_parameters: unknown) {}
  scan(_context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    return diagnostics;
  }
}
