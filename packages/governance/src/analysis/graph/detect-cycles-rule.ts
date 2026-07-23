// packages/governance/src/analysis/graph/detect-cycles-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../../context/governance-context.js';
import { GovernanceRuleId } from '../../engine/governance-rule-id.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';

import { buildWorkspaceGraph } from './build-workspace-graph.js';
import { detectCycles } from './detect-cycles.js';

export class DetectCyclesRule implements GovernanceRule<GovernanceContext> {
  readonly id = GovernanceRuleId.DetectCycles;
  readonly name = 'detect-cycles-rule';
  run(context: GovernanceContext): Diagnostic[] {
    const graph = buildWorkspaceGraph(context);

    const { hasCycle, cycles } = detectCycles(graph.edges);

    if (!hasCycle) {
      return [];
    }

    return cycles.map((cycle) => ({
      code: 'CYCLE_DETECTED',
      severity: 'error',
      source: this.name,
      message: `Cycle detected: ${cycle.join(' -> ')}`,
      metadata: { cycle },
    }));
  }
}
