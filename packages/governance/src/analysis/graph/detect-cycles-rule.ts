// packages/governance/src/analysis/graph/detect-cycles-rule.ts

import type { Diagnostic } from '../../diagnostics/diagnostic.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';
import type { GovernanceContext } from '../../types/governance-context.js';

import { buildWorkspaceGraph } from './build-workspace-graph.js';
import { detectCycles } from './detect-cycles.js';

export class DetectCyclesRule implements GovernanceRule {
  readonly name = 'detect-cycles-rule';
  run(context: GovernanceContext): Promise<Diagnostic[]> {
    const graph = buildWorkspaceGraph(context);

    const result = detectCycles(graph.nodes);

    if (!result.hasCycle) {
      return Promise.resolve([]);
    }

    return Promise.resolve(
      result.cycles.map((cycle) => ({
        code: 'CYCLE_DETECTED',
        severity: 'error',
        source: this.name,
        message: `Cycle detected: ${cycle.join(' -> ')}`,
        metadata: { cycle },
      })),
    );
  }
}
