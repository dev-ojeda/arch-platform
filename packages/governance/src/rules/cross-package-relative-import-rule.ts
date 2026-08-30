// packages/governance/src/rules/cross-package-relative-import-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../context/governance-execution-context.js';
import { GOVERNANCE_RULE_ID } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceScope } from '../public/governance-scope.js';

import { CrossPackageRelativeImportScanner } from './cross-package-relative-import-scanner.js';

export class CrossPackageRelativeImportRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GOVERNANCE_RULE_ID.CrossPackageRelativeImportRule;
  readonly name = 'cross-package-relative-import';

  constructor(private readonly scanner = new CrossPackageRelativeImportScanner()) {}

  run(context: GovernanceExecutionContext): Diagnostic[] {
    return this.scanner.scan(context);
  }

  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }
}
