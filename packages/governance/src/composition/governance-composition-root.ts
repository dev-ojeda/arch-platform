// packages/governance/src/composition/governance-composition-root.ts

import { DetectCyclesRule } from '../analysis/graph/detect-cycles-rule.js';
import { GovernanceEngine } from '../engine/governance-engine.js';
import { DependencyLayerRule } from '../rules/dependency-layer-rule.js';
import { ForbiddenDependencyRule } from '../rules/forbidden-dependency-rule.js';
import { ValidatePackageStructureRule } from '../rules/validate-package-structure.rule.js';
import { WorkspacePackageRule } from '../workspace/workspace-package-rule.js';

import type { GovernanceRule } from '../engine/governance-rule.js';

export class GovernanceCompositionRoot {
  createEngine(additionalRules: readonly GovernanceRule[] = []): GovernanceEngine {
    return new GovernanceEngine([...this.createRules(), ...additionalRules]);
  }

  private createRules(): GovernanceRule[] {
    return [
      new WorkspacePackageRule(),
      new ValidatePackageStructureRule(),
      new ForbiddenDependencyRule(),
      new DetectCyclesRule(),
      new DependencyLayerRule(),
      // this.createOnlyPublicApiRule(),
    ];
  }

  // private createOnlyPublicApiRule(): GovernanceRule {
  //   return new OnlyPublicApiRule(this.createPublicApiScanner());
  // }

  // private createPublicApiScanner(): PublicApiScanner {
  //   return new PublicApiScanner(new PrivatePathDetector(), new ExportMapReader());
  // }
}
