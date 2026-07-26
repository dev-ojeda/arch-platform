// packages/governance/src/engine/governance-rule.ts

import type { Diagnostic, MaybePromise } from '@arch/platform-model';

import type { GovernanceRuleId } from './governance-rule-id.js';
import type { GovernanceContext } from '../context/governance-context.js';
import type { GovernanceScope } from '../context/governance-scope.js';


/**
 * A governance rule that validates some aspect of a workspace.
 *
 * Implementations may execute synchronously or asynchronously.
 * Consumers should always use `await` when invoking {@link run}.
 */
export interface GovernanceRule<TContext extends GovernanceContext = GovernanceContext> {
  readonly id: GovernanceRuleId;
  readonly name: string;

  supports?(scope: GovernanceScope): boolean;

  run(context: TContext): MaybePromise<Diagnostic[]>;
}
