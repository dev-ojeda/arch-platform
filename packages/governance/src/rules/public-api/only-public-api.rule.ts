// packages/governance/src/rules/public-api/only-public-api.rule.ts

import type { Diagnostic } from '../../diagnostics/diagnostic.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';
import type { GovernanceExecutionContext } from '../../types/governance-context.js';

import { PublicApiScanner } from './public-api-scanner.js';

export class OnlyPublicApiRule implements GovernanceRule {
  readonly name = 'only-public-api';

  private readonly scanner = new PublicApiScanner();

  async run(context: GovernanceExecutionContext): Promise<Diagnostic[]> {
    return await this.scanner.scan(context);
  }
}
