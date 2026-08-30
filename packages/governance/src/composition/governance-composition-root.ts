// packages/governance/src/composition/governance-composition-root.ts

import { NodeArchitectureProvider, NodeWorkspaceProvider } from '@arch/infrastructure';

import { CodeAnalysisAdapter } from '../analysis/code-analysis/code-analysis-adapter.js';
import { createGovernanceAnalysisContext } from '../analysis/code-analysis/create-governance-analysis-context.js';
import type { GovernanceContext } from '../context/governance-context.js';
import { GovernanceEngine } from '../engine/governance-engine.js';

import { GovernanceRulesFactory } from './governance-rules-factory.js';

export class GovernanceCompositionRoot {
  create() {
    const analysisAdapter = new CodeAnalysisAdapter();
    const { rules } = new GovernanceRulesFactory().create();

    return {
      architectureProvider: new NodeArchitectureProvider(),
      workspaceProvider: new NodeWorkspaceProvider(),

      createGovernanceExecutionContext: (context: GovernanceContext) =>
        createGovernanceAnalysisContext(context, analysisAdapter),

      engine: new GovernanceEngine(rules),
    };
  }
}
