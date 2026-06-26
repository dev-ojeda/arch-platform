// packages/governance/src/rules/public-api/public-api-scanner.ts

import type { Diagnostic } from '../../diagnostics/diagnostic.js';
import type { GovernanceExecutionContext } from '../../types/governance-context.js';

import { PrivatePathDetector } from './private-path-detector.js';

export class PublicApiScanner {
  private readonly privatePathDetector = new PrivatePathDetector();

  async scan(context: GovernanceExecutionContext): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];

    const graph = context.analysis.symbolGraph;

    const symbols = new Map(graph.nodes.map((node) => [node.name, node]));

    for (const edge of graph.edges) {
      if (edge.type !== 'import') {
        continue;
      }

      const source = symbols.get(edge.from);

      const target = symbols.get(edge.to);

      if (!source || !target) {
        continue;
      }

      // Import dentro del mismo package
      if (source.package === target.package) {
        continue;
      }

      if (!target.exported) {
        diagnostics.push({
          code: 'ARCH_ONLY_PUBLIC_API',

          severity: 'error',

          source: 'governance',

          message: `Package ${source.package} imports non-public symbol ${target.name} from ${target.package}`,

          hint: `Expose ${target.name} through the public package API`,

          metadata: {
            rule: 'OnlyPublicApiRule',

            importer: source.package,

            imported: target.package,

            symbol: target.name,
          },
        });
      }
    }

    return Promise.resolve(diagnostics);
  }
}
