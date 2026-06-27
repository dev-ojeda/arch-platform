// packages/tooling/src/runtime/filesystem/collect-tsbuildinfo-files.ts

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { logger } from '../../logging/logger.js';

import { IGNORED_DIRECTORIES } from './ignored-directories.js';

export async function collectTsBuildInfoFiles(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, {
      withFileTypes: true,
    });

    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) {
          continue;
        }

        files.push(...(await collectTsBuildInfoFiles(fullPath)));

        continue;
      }

      if (entry.name.endsWith('.tsbuildinfo')) {
        files.push(fullPath);
      }
    }

    return files;
  } catch (error) {
    logger.error('tooling.filesystem.scan.failed', {
      metadata: {
        directory,
        error: String(error),
      },
    });

    return [];
  }
}
