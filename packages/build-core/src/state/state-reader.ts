// packages/build-core/src/state/state-reader.ts

import { pathExistsSync, readJsonFileSync } from '../fs/fs-sync.js';
import { getStatePath } from '../fs/path-utils.js';
import type { HashResult } from '../hash/hash-result.js';
import { logger } from '../logging/logger.js';
import { isRecord } from '../serialization/type-guards.js';

import type { BuildState, BuildStateEntry } from './state-types.js';

function isHashResult(value: unknown): value is HashResult {
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

function isBuildStateEntry(value: unknown): value is BuildStateEntry {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isHashResult(value.hash) &&
    Array.isArray(value.outputs) &&
    value.outputs.every((x) => typeof x === 'string') &&
    typeof value.timestamp === 'number' &&
    typeof value.schemaVersion === 'number'
  );
}

export function loadBuildState(workspaceRoot: string): BuildState {
  const statePath = getStatePath(workspaceRoot);

  if (!pathExistsSync(statePath)) {
    logger.trace('state.file.missing', {
      metadata: {
        statePath,
      },
    });

    return new Map();
  }

  const parsed = readJsonFileSync(statePath);

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
    if (!isBuildStateEntry(value)) {
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
