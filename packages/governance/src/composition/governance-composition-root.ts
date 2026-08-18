// packages/governance/src/composition/governance-composition-root.ts

import { NodeArchitectureProvider, NodeWorkspaceProvider } from '@arch/infrastructure';

import { CodeAnalysisAdapter } from '../analysis/code-analysis/code-analysis-adapter.js';
import { createGovernanceAnalysisContext } from '../analysis/code-analysis/create-governance-analysis-context.js';
import { DetectCyclesRule } from '../analysis/graph/detect-cycles-rule.js';
import { TypeOnlyExportSemanticScanner } from '../analysis/index.js';
import { TypeOnlyImportSemanticScanner } from '../analysis/semantics/scanners/type-only-import-semantic-scanner.js';
import type {
  GovernanceContext,
  GovernanceExecutionContext,
} from '../context/governance-context.js';
import { GovernanceEngine } from '../engine/governance-engine.js';
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

export class GovernanceCompositionRoot {
  create() {
    const analysisAdapter = new CodeAnalysisAdapter();

    return {
      architectureProvider: new NodeArchitectureProvider(),
      workspaceProvider: new NodeWorkspaceProvider(),

      createExecutionContext: (context: GovernanceContext): Promise<GovernanceExecutionContext> =>
        createGovernanceAnalysisContext(context, analysisAdapter),

      engine: this.createEngine(),
    };
  }
  createEngine(additionalRules: readonly GovernanceRule[] = []): GovernanceEngine {
    return new GovernanceEngine([...this.createRules(), ...additionalRules]);
  }

  private createRules(): GovernanceRule[] {
    return [...this.createWorkspaceRules(), ...this.createCrossScopeRules()];
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
