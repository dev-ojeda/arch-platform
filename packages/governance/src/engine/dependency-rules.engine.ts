// packages/governance/src/engine/dependency-rules.engine.ts

import { type DependencyMatrix, type Diagnostic, type Layer } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';
import { DEFAULT_MATRIX } from '../policies/default-dependency-matrix.js';

function isLayer(value: unknown): value is Layer {
  return (
    value === 'domain' ||
    value === 'infra' ||
    value === 'app' ||
    value === 'sdk' ||
    value === 'tooling'
  );
}

function getLayerFromPackage(
  pkg: GovernanceContext['workspace']['packages'][number],
): Layer | undefined {
  const layer = pkg.manifest.arch?.layer;
  return isLayer(layer) ? layer : undefined;
}

export class DependencyRulesEngine {
  constructor(private readonly matrix: DependencyMatrix = DEFAULT_MATRIX) {}

  run(context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    const packageMap = new Map(context.workspace.packages.map((p) => [p.name, p]));

    for (const pkg of context.workspace.packages) {
      const fromLayer = getLayerFromPackage(pkg);
      if (!fromLayer) continue;

      const deps = pkg.internalDependencies ?? [];

      for (const depName of deps) {
        const depPkg = packageMap.get(depName);
        if (!depPkg) continue;

        const toLayer = getLayerFromPackage(depPkg);
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

  private getLayerFromPackage(
    pkg: GovernanceContext['workspace']['packages'][number],
  ): Layer | undefined {
    const layer = pkg.manifest.arch?.layer;
    return isLayer(layer) ? layer : undefined;
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
