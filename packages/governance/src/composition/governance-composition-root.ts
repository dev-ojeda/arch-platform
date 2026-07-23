// packages/governance/src/composition/governance-composition-root.ts

import { GovernanceEngine } from '../engine/governance-engine.js';
import type { GovernanceRule } from '../engine/governance-rule.js';

import { createGovernanceRules } from './governance-rules.js';

export class GovernanceCompositionRoot {
  createEngine(additionalRules: readonly GovernanceRule[] = []): GovernanceEngine {
    return new GovernanceEngine(createGovernanceRules(additionalRules));
  }
}
