// packages/build-core/src/cache/cache-evaluator.ts

import { HASH_SCHEMA_VERSION } from '@arch/platform-model';
import type { HashResult, OutputValidator } from '@arch/platform-model';

import { logger } from '../logging/logger.js';
import type { BuildState } from '../state/state-types.js';

import type { CacheEvaluation } from './cache-evaluation.js';
import type { ChangeReason } from './cache-types.js';

export class CacheEvaluator {
  constructor(
    private state: BuildState,
    private outputValidator: OutputValidator,
  ) {}

  async evaluate(
    packageName: string,
    root: string,
    outputs: readonly string[],
    dependencies: readonly string[],
    current: HashResult,
  ): Promise<CacheEvaluation> {
    const previous = this.state.get(packageName);

    if (!previous) {
      logger.trace('build.cache.evaluated', {
        category: 'cache',
        metadata: {
          packageName,
          decision: 'miss',
          changeReason: 'first-build',
        },
      });
      return {
        decision: 'miss',
        changeReason: 'first-build',
      };
    }

    if (previous.schemaVersion !== HASH_SCHEMA_VERSION) {
      return this.stale(packageName, 'cache-version');
    }

    if (previous.hash.sourceHash !== current.sourceHash) {
      return this.stale(packageName, 'source');
    }

    if (previous.hash.configHash !== current.configHash) {
      return this.stale(packageName, 'config');
    }

    if (previous.hash.depsHash !== current.depsHash) {
      return this.stale(packageName, 'dependency');
    }

    const dependencyMissing = await this.hasMissingDependencyOutputs(dependencies, root);

    if (dependencyMissing) {
      logger.trace('build.cache.evaluated', {
        category: 'cache',
        metadata: {
          packageName,
          decision: 'restore',
          changeReason: 'missing-output',
        },
      });
      return {
        decision: 'restore',
        changeReason: 'missing-output',
      };
    }

    if (!(await this.outputValidator.exists(root, outputs))) {
      logger.trace('build.cache.evaluated', {
        category: 'cache',
        metadata: {
          packageName,
          decision: 'invalid',
          changeReason: 'missing-output',
        },
      });
      return {
        decision: 'invalid',
        changeReason: 'missing-output',
      };
    }
    logger.trace('build.cache.evaluated', {
      category: 'cache',
      metadata: {
        packageName,
        decision: 'hit',
        changeReason: 'none',
      },
    });
    return {
      decision: 'hit',
      changeReason: 'none',
    };
  }

  private stale(packageName: string, reason: ChangeReason): CacheEvaluation {
    return {
      decision: 'stale',
      changeReason: reason,
    };
  }
  private async hasMissingDependencyOutputs(
    dependencies: readonly string[],
    root: string,
  ): Promise<boolean> {
    for (const dependency of dependencies) {
      const entry = this.state.get(dependency);

      if (!entry) {
        logger.trace('build.cache.dependency.missing', {
          category: 'cache',
          metadata: {
            packageName: dependency,
            reason: 'missing-state',
            root,
          },
        });

        return true;
      }

      logger.trace('build.cache.dependency.check', {
        category: 'cache',
        metadata: {
          packageName: dependency,
          outputs: entry.outputs,
          root,
        },
      });

      const exists = await this.outputValidator.exists(root, entry.outputs);

      logger.trace('build.cache.dependency.result', {
        category: 'cache',
        metadata: {
          packageName: dependency,
          exists,
        },
      });

      if (!exists) {
        return true;
      }
    }

    return false;
  }
}
