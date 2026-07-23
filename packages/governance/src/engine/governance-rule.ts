// packages/governance/src/engine/governance-rule.ts

import type { Diagnostic, MaybePromise } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';

import type { GovernanceRuleId } from './governance-rule-id.js';

/**
 * A governance rule that validates some aspect of a workspace.
 *
 * Implementations may execute synchronously or asynchronously.
 * Consumers should always use `await` when invoking {@link run}.
 */
export interface GovernanceRule<TContext extends GovernanceContext = GovernanceContext> {
  readonly id: GovernanceRuleId;

  readonly name: string;

  /**
   * Executes the rule.
   */
  run(context: TContext): MaybePromise<Diagnostic[]>;
}
