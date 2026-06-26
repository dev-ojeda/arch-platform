// packages/governance/src/rules/default-governance-rules.ts

import { DetectCyclesRule } from '../analysis/graph/detect-cycles-rule.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import { WorkspacePackageRule } from '../workspace/workspace-package-rule.js';

import { DependencyLayerRule } from './dependency-layer-rule.js';
import { ForbiddenDependencyRule } from './forbidden-dependency-rule.js';
import { ValidatePackageStructureRule } from './validate-package-structure.rule.js';

export function createDefaultGovernanceRules(): GovernanceRule[] {
  return [
    // Workspace structure
    new WorkspacePackageRule(),

    new ValidatePackageStructureRule(),

    // Dependency governance
    new ForbiddenDependencyRule(),

    new DetectCyclesRule(),

    // Architecture governance
    new DependencyLayerRule(),
  ];
}
