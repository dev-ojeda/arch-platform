// packages/build-core/src/cache/cache-evaluator.ts

import type {
  ArtifactCache,
  ArtifactProvider,
  BuildState,
  HashResult,
  OutputValidator,
} from '@arch/platform-model';

import { GraphQueryService } from '../graph/graph-query-services.js';
import { HASH_SCHEMA_VERSION } from '../hash/hash-schema-version.js';
import { logger } from '../logging/logger.js';

import type { CacheEvaluation } from './cache-evaluation.js';
import type { ChangeReason } from './cache-types.js';

export class CacheEvaluator {
  constructor(
    private readonly state: BuildState,
    private readonly outputValidator: OutputValidator,
    private readonly query: GraphQueryService,
    private readonly artifactCache: ArtifactCache,
    private readonly artifactProvider: ArtifactProvider,
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
        packageName,
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

    // const dependencyMissing = await this.hasMissingDependencyOutputs(dependencies);

    // if (dependencyMissing) {
    //   logger.trace('build.cache.evaluated', {
    //     category: 'cache',
    //     metadata: {
    //       packageName,
    //       decision: 'restore',
    //       changeReason: 'missing-output',
    //     },
    //   });

    //   return {
    //     packageName,
    //     decision: 'restore',
    //     changeReason: 'missing-output',
    //   };
    // }

    if (!(await this.outputValidator.exists(root, outputs))) {
      const artifact = this.artifactProvider.create(packageName, current);

      const available = await this.artifactCache.exists(artifact);

      logger.trace('build.cache.artifact', {
        category: 'cache',
        metadata: {
          packageName,
          available,
        },
      });

      if (available) {
        return {
          packageName,
          decision: 'restore',
          changeReason: 'missing-output',
        };
      }

      return {
        packageName,
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
      packageName,
      decision: 'hit',
      changeReason: 'none',
    };
  }

  private stale(packageName: string, reason: ChangeReason): CacheEvaluation {
    return {
      packageName: packageName,
      decision: 'stale',
      changeReason: reason,
    };
  }

  private async hasMissingDependencyOutputs(dependencies: readonly string[]): Promise<boolean> {
    for (const dependency of dependencies) {
      const entry = this.state.get(dependency);

      if (!entry) {
        logger.trace('build.cache.dependency.missing', {
          category: 'cache',
          metadata: {
            packageName: dependency,
            reason: 'missing-state',
          },
        });

        return true;
      }

      const node = this.query.getNode(dependency);

      logger.trace('build.cache.dependency.check', {
        category: 'cache',
        metadata: {
          packageName: dependency,
          root: node.root,
          outputs: node.outputs,
        },
      });

      const exists = await this.outputValidator.exists(node.root, node.outputs);

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
