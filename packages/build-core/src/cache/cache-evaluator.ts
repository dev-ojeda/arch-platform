// packages/build-core/src/cache/cache-evaluator.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import { createArtifactKey } from '../artifact/artifact-key.js';
import type { OutputValidator } from '../artifact/output-validator.js';
import type { HashResult } from '../hash/hash-result.js';
import { HASH_SCHEMA_VERSION } from '../hash/hash-version.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { logger } from '../logging/logger.js';
import type { BuildState } from '../state/state-types.js';

import type { CacheDecision, ChangeReason } from './cache-types.js';

export interface CacheEvaluation {
  decision: CacheDecision;
  changeReason: ChangeReason;
}

export class CacheEvaluator {
  constructor(
    private state: BuildState,
    private outputValidator: OutputValidator,
    private artifactCache: ArtifactCache,
  ) {}

  async evaluate(
    packageName: string,
    root: string,
    outputs: string[],
    dependencies: string[],
    current: HashResult,
  ): Promise<CacheEvaluation> {
    logger.trace(LOG_EVENTS.CACHE_EVALUATE, {
      metadata: {
        packageName,
        dependencies,
        hasPackage: this.state.has(packageName),
        stateSize: this.state.size,
      },
    });

    const previous = this.state.get(packageName);

    if (!previous) {
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

    const dependencyMissing = this.hasMissingDependencyOutputs(dependencies, root);

    if (dependencyMissing) {
      return {
        decision: 'restore',
        changeReason: 'missing-output',
      };
    }

    if (!this.outputValidator.exists(root, outputs)) {
      const key = this.getArtifactKey(previous.hash);

      if (await this.artifactCache.exists(key)) {
        return {
          decision: 'restore',
          changeReason: 'missing-output',
        };
      }

      return {
        decision: 'invalid',
        changeReason: 'missing-output',
      };
    }

    return {
      decision: 'hit',
      changeReason: 'none',
    };
  }

  private stale(packageName: string, reason: ChangeReason): CacheEvaluation {
    logger.trace(LOG_EVENTS.CACHE_STALE, {
      metadata: {
        packageName,
        reason,
      },
    });

    return {
      decision: 'stale',
      changeReason: reason,
    };
  }

  private getArtifactKey(hash: HashResult): string {
    return createArtifactKey(hash);
  }
  private hasMissingDependencyOutputs(dependencies: string[], root: string): boolean {
    for (const dependency of dependencies) {
      const entry = this.state.get(dependency);

      if (!entry) {
        return true;
      }

      if (!this.outputValidator.exists(root, entry.outputs)) {
        return true;
      }
    }

    return false;
  }
}
