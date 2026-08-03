// packages/governance/src/composition/governance-composition-root.ts

import { NodeWorkspaceProvider } from '@arch/infrastructure';

import { CodeAnalysisAdapter } from '../analysis/code-analysis/code-analysis-adapter.js';
import { createGovernanceAnalysisContext } from '../analysis/code-analysis/create-governance-analysis-context.js';
import { DetectCyclesRule } from '../analysis/graph/detect-cycles-rule.js';
import type {
  GovernanceContext,
  GovernanceExecutionContext,
} from '../context/governance-context.js';
import { GovernanceEngine } from '../engine/governance-engine.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import { DependencyLayerRule } from '../rules/dependency-layer-rule.js';
import { ForbiddenDependencyRule } from '../rules/forbidden-dependency-rule.js';
import { ExportMapReader } from '../rules/public-api/export-map-reader.js';
import { OnlyPublicApiRule } from '../rules/public-api/only-public-api.rule.js';
import { PrivatePathDetector } from '../rules/public-api/private-path-detector.js';
import { PublicApiScanner } from '../rules/public-api/public-api-scanner.js';
import { ValidatePackageStructureRule } from '../rules/validate-package-structure.rule.js';
import { WorkspacePackageRule } from '../workspace/workspace-package-rule.js';

export class GovernanceCompositionRoot {
  create() {
    const analysisAdapter = new CodeAnalysisAdapter();

    return {
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
    return [
      new WorkspacePackageRule(),
      new ValidatePackageStructureRule(),
      new ForbiddenDependencyRule(),
      new DetectCyclesRule(),
      new DependencyLayerRule(),
      this.createOnlyPublicApiRule(),
    ];
  }

  private createOnlyPublicApiRule(): GovernanceRule {
    return new OnlyPublicApiRule(this.createPublicApiScanner());
  }

  private createPublicApiScanner(): PublicApiScanner {
    return new PublicApiScanner(new PrivatePathDetector(), new ExportMapReader());
  }
}
