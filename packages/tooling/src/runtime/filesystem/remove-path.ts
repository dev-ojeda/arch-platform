// packages/tooling/src/runtime/filesystem/remove-path.ts

import { rm } from 'node:fs/promises';

import { logger } from '../../utils/logger.js';

import { normalizePathPermissions } from './normalize-path-permissions.js';

export interface RemovePathOptions {
  readonly force?: boolean;

  readonly recursive?: boolean;

  readonly maxRetries?: number;

  readonly retryDelay?: number;

  readonly normalizePermissions?: boolean;
}

const DEFAULT_REMOVE_PATH_OPTIONS = {
  force: true,
  recursive: true,
  maxRetries: 5,
  retryDelay: 250,
  normalizePermissions: true,
} as const satisfies Required<RemovePathOptions>;

function resolveRemovePathOptions(options: RemovePathOptions): Required<RemovePathOptions> {
  return {
    ...DEFAULT_REMOVE_PATH_OPTIONS,
    ...options,
  };
}

export async function removePath(
  targetPath: string,
  options: RemovePathOptions = {},
): Promise<void> {
  const resolvedOptions = resolveRemovePathOptions(options);

  try {
    if (resolvedOptions.normalizePermissions) {
      await normalizePathPermissions(targetPath);
    }

    await rm(targetPath, {
      recursive: resolvedOptions.recursive,
      force: resolvedOptions.force,
      maxRetries: resolvedOptions.maxRetries,
      retryDelay: resolvedOptions.retryDelay,
    });
  } catch (error) {
    if (error instanceof Error && !error.message.includes('ENOENT')) {
      logger.warn('tooling.clean.remove.failed', {
        metadata: {
          targetPath,
          error: error.message,
        },
      });
    }
  }
}
