// packages/governance/src/composition/governance-rules.ts

import { DetectCyclesRule } from '../analysis/graph/detect-cycles-rule.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import { DependencyLayerRule } from '../rules/dependency-layer-rule.js';
import { ForbiddenDependencyRule } from '../rules/forbidden-dependency-rule.js';
import { OnlyPublicApiRule } from '../rules/public-api/only-public-api.rule.js';
import { ValidatePackageStructureRule } from '../rules/validate-package-structure.rule.js';
import { WorkspacePackageRule } from '../workspace/workspace-package-rule.js';

export function createGovernanceRules(
  additionalRules: readonly GovernanceRule[] = [],
): readonly GovernanceRule[] {
  return [
    new WorkspacePackageRule(),

    new ValidatePackageStructureRule(),

    new ForbiddenDependencyRule(),

    new DetectCyclesRule(),

    new DependencyLayerRule(),

    new OnlyPublicApiRule(),

    ...additionalRules,
  ];
}
