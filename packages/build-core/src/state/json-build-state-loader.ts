// packages/build-core/src/state/json-build-state-loader.ts

import type { FileSystemSyncPort, PathService } from '@arch/contracts';
import type { HashResult } from '@arch/platform-model';

import { logger } from '../logging/logger.js';
import { isRecord } from '../serialization/type-guards.js';

import type { BuildStateLoader } from './build-state-loader.js';
import { getBuildStatePath } from './state-paths.js';
import type { BuildState, BuildStateEntry } from './state-types.js';

export class JsonBuildStateLoader implements BuildStateLoader {
  constructor(
    private readonly filesystem: FileSystemSyncPort,
    private readonly pathService: PathService,
  ) {}
  load(workspaceRoot: string): BuildState {
    const statePath = getBuildStatePath(workspaceRoot, this.pathService);

    if (!this.filesystem.exists(statePath)) {
      logger.trace('state.file.missing', {
        metadata: {
          statePath,
        },
      });

      return new Map();
    }

    const parsed = this.filesystem.read(statePath);

    if (!isRecord(parsed)) {
      logger.warn('state.invalid.root', {
        metadata: {
          statePath,
        },
      });

      return new Map();
    }

    const entries = Object.entries(parsed);

    const state = new Map<string, BuildStateEntry>();

    for (const [name, value] of entries) {
      if (!this.isBuildStateEntry(value)) {
        logger.warn('INVALID_BUILD_STATE_ENTRY', {
          metadata: {
            packageName: name,
          },
        });

        continue;
      }

      state.set(name, value);
    }

    logger.trace('BUILD_STATE_LOADED', {
      metadata: {
        packages: [...state.keys()],
      },
    });

    return state;
  }

  private isHashResult(value: unknown): value is HashResult {
    if (!isRecord(value)) {
      return false;
    }

    return (
      typeof value.hash === 'string' &&
      typeof value.sourceHash === 'string' &&
      typeof value.depsHash === 'string' &&
      typeof value.configHash === 'string' &&
      typeof value.schemaVersion === 'number'
    );
  }

  private isBuildStateEntry(value: unknown): value is BuildStateEntry {
    if (!isRecord(value)) {
      return false;
    }

    return (
      this.isHashResult(value.hash) &&
      Array.isArray(value.outputs) &&
      value.outputs.every((x) => typeof x === 'string') &&
      typeof value.timestamp === 'number' &&
      typeof value.schemaVersion === 'number'
    );
  }
}
