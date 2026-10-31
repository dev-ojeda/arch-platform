// packages/build-core/src/cache/cache-evaluator.ts

import type {
  ArtifactCache,
  ArtifactProvider,
  BuildState,
  HashResult,
  OutputValidator,
} from '@arch-platform/platform-model';

import { HASH_SCHEMA_VERSION } from '../hash/hash-schema-version.js';
import { logger } from '../logging/logger.js';

import type { CacheEvaluation } from './cache-evaluation.js';
import type { ChangeReason } from './cache-types.js';

export class CacheEvaluator {
  constructor(
    private readonly state: BuildState,
    private readonly outputValidator: OutputValidator,
    private readonly artifactCache: ArtifactCache,
    private readonly artifactProvider: ArtifactProvider,
  ) {}
  async evaluate(
    packageName: string,
    root: string,
    outputs: readonly string[],
    current: HashResult,
  ): Promise<CacheEvaluation> {
    const previous = this.state.get(packageName);

    if (!previous) {
      const artifact = this.artifactProvider.create(packageName, current);
      const available = await this.artifactCache.exists(artifact);

      if (available) {
        logger.trace('build.cache.evaluated', {
          category: 'cache',
          metadata: {
            packageName,
            decision: 'restore',
            changeReason: 'first-build',
            available: available,
          },
        });

        return {
          packageName,
          decision: 'restore',
          changeReason: 'first-build',
          available: available,
        };
      }

      logger.trace('build.cache.evaluated', {
        category: 'cache',
        metadata: {
          packageName,
          decision: 'miss',
          changeReason: 'first-build',
          available: available,
        },
      });

      return {
        packageName,
        decision: 'miss',
        changeReason: 'first-build',
        available: available,
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

    const artifact = this.artifactProvider.create(packageName, current);

    const outputsExist = await this.outputValidator.exists(root, outputs);

    if (outputsExist && (await this.artifactCache.verifyOutputs(artifact, root))) {
      const available = await this.artifactCache.exists(artifact);
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
        available: available,
      };
    }

    const changeReason: ChangeReason = outputsExist ? 'output-integrity' : 'missing-output';

    const available = await this.artifactCache.exists(artifact);

    if (available) {
      logger.trace('build.cache.evaluated', {
        category: 'cache',
        metadata: {
          packageName,
          decision: 'restore',
          changeReason,
          available: available,
        },
      });

      return {
        packageName,
        decision: 'restore',
        changeReason,
        available: available,
      };
    }

    logger.trace('build.cache.evaluated', {
      category: 'cache',
      metadata: {
        packageName,
        decision: 'invalid',
        changeReason,
        available: available,
      },
    });

    return {
      packageName,
      decision: 'invalid',
      changeReason,
      available: available,
    };
  }

  private stale(packageName: string, reason: ChangeReason): CacheEvaluation {
    return {
      packageName: packageName,
      decision: 'stale',
      changeReason: reason,
      available: true,
    };
  }
}
