// packages/governance/src/composition/governance-rules-factory.ts

import { DetectCyclesRule } from '../analysis/graph/detect-cycles-rule.js';
import { TypeOnlyExportSemanticScanner } from '../analysis/semantics/scanners/type-only-export-semantic-scanner.js';
import { TypeOnlyImportSemanticScanner } from '../analysis/semantics/scanners/type-only-import-semantic-scanner.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import { CrossPackageRelativeImportRule } from '../rules/cross-package-relative-import-rule.js';
import { CrossPackageRelativeImportScanner } from '../rules/cross-package-relative-import-scanner.js';
import { DependencyLayerRule } from '../rules/dependency-layer-rule.js';
import { ForbiddenDependencyRule } from '../rules/forbidden-dependency-rule.js';
import { ValidatePackageStructureRule } from '../rules/package-structure/validate-package-structure.rule.js';
import { DetectPrivateBarrelRule } from '../rules/public-api/detect-private-barrel-rule.js';
import { OnlyPublicApiRule } from '../rules/public-api/only-public-api.rule.js';
import { PrivateBarrelScanner } from '../rules/public-api/private-barrel-scanner.js';
import { PublicApiScanner } from '../rules/public-api/public-api-scanner.js';
import { TypeOnlyExportRule } from '../rules/type-only-export-rule.js';
import { TypeOnlyImportRule } from '../rules/type-only-import-rule.js';
import { WorkspacePackageRule } from '../workspace/workspace-package-rule.js';

export class GovernanceRulesFactory {
  create() {
    return {
      rules: [...this.createWorkspaceRules(), ...this.createCrossScopeRules()],
    };
  }

  private createWorkspaceRules(): GovernanceRule[] {
    return [
      new WorkspacePackageRule(),
      new DependencyLayerRule(),
      new DetectCyclesRule(),
      new OnlyPublicApiRule(new PublicApiScanner()),
    ];
  }

  private createCrossScopeRules(): GovernanceRule[] {
    return [
      new ForbiddenDependencyRule(),
      new ValidatePackageStructureRule(),
      new TypeOnlyImportRule([new TypeOnlyImportSemanticScanner()]),
      new TypeOnlyExportRule([new TypeOnlyExportSemanticScanner()]),
      new DetectPrivateBarrelRule([new PrivateBarrelScanner()]),
      new CrossPackageRelativeImportRule(new CrossPackageRelativeImportScanner()),
    ];
  }
}
