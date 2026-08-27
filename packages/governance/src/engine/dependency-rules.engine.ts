// packages/governance/src/engine/dependency-rules.engine.ts

import type { DependencyMatrix, Diagnostic, Layer } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';
import { DEFAULT_MATRIX } from '../policies/default-dependency-matrix.js';

export class DependencyRulesEngine {
  constructor(private readonly matrix: DependencyMatrix = DEFAULT_MATRIX) {}

  run(context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    const packageMap = new Map(context.workspace.packages.map((p) => [p.name, p]));
    for (const pkg of context.packages.scoped(context.scope)) {
      const fromLayer = this.getKindFromPackage(pkg);
      if (!fromLayer) continue;

      const deps = pkg.internalDependencies ?? [];

      for (const depName of deps) {
        const depPkg = packageMap.get(depName);
        if (!depPkg) continue;

        const toLayer = this.getKindFromPackage(depPkg);

        if (!toLayer) continue;

        const rule = this.matrix[fromLayer]?.[toLayer] ?? 'allow';

        if (rule === 'deny') {
          diagnostics.push({
            code: 'INVALID_LAYER_DEPENDENCY',
            severity: 'error',
            source: 'dependency-rules-engine',
            message: `${pkg.name} (${fromLayer}) cannot depend on ${depName} (${toLayer})`,
            location: {
              file: pkg.manifestPath,
            },
            metadata: {
              from: pkg.name,
              to: depName,
              fromLayer,
              toLayer,
            },
            hint: `Remove dependency or change architectural layer`,
          });
        }
      }
    }

    return diagnostics;
  }

  private getKindFromPackage(
    pkg: GovernanceContext['workspace']['packages'][number],
  ): Layer | undefined {
    const kind = pkg.manifest.arch?.kind;
    return this.isLayer(kind) ? kind : undefined;
  }
  private isLayer(value: unknown): value is Layer {
    return (
      value === 'domain' ||
      value === 'infra' ||
      value === 'app' ||
      value === 'sdk' ||
      value === 'tooling'
    );
  }
}
