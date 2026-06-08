// packages/governance/src/rules/default-governance-rules.ts

import type { GovernanceRule } from '../engine/governance-rule.js';
import { ValidatePackageStructureRule } from '../workspace/validate-package-structure.rule.js';
import { WorkspacePackageRule } from '../workspace/workspace-package-rule.js';

import { PackageJsonRule } from './package-json-rule.js';

export function createDefaultGovernanceRules(): GovernanceRule[] {
  return [new WorkspacePackageRule(), new PackageJsonRule(), new ValidatePackageStructureRule()];
}
