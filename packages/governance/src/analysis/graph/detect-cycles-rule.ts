// packages/governance/src/analysis/graph/detect-cycles-rule.ts

import { GovernanceRuleId } from '../../engine/governance-rule-id.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';
import type { Diagnostic } from '../../types/diagnostic.js';
import type { GovernanceContext } from '../../types/governance-context.js';

import { buildWorkspaceGraph } from './build-workspace-graph.js';
import { detectCycles } from './detect-cycles.js';

export class DetectCyclesRule implements GovernanceRule {
  readonly id = GovernanceRuleId.DetectCycles;
  readonly name = 'detect-cycles-rule';

  run(context: GovernanceContext): Promise<Diagnostic[]> {
    const graph = buildWorkspaceGraph(context);

    const result = detectCycles(graph.nodes);

    if (!result.hasCycle) {
      const diagnostics: Diagnostic[] = [];

      return Promise.resolve(diagnostics);
    }

    const diagnostics = result.cycles.map<Diagnostic>((cycle) => ({
      code: 'CYCLE_DETECTED',
      severity: 'error',
      source: this.name,
      message: `Cycle detected: ${cycle.join(' -> ')}`,
      metadata: { cycle },
    }));

    return Promise.resolve(diagnostics);
  }
}
