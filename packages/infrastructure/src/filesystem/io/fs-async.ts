// packages/infrastructure/src/filesystem/io/fs-async.ts

import {
  access,
  chmod,
  cp,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';

import type { DirectoryEntry } from '@arch/contracts';

import { LOG_EVENTS } from '../../logging/log-events.js';
import { loggerFactory } from '../../logging/logger.js';
import { hasErrorCode } from '../errors/errno-utils.js';

import { joinPath } from './path-utils.js';
import { retryFsOperation } from './retry-fs-operation.js';

const logger = loggerFactory.createLogger({
  component: 'fs-async',
});

const IGNORED_DIRECTORIES = new Set(['.git', '.turbo', 'node_modules', 'dist', 'coverage']);
type CopyPathAsyncOptions = Parameters<typeof cp>[2];

//#region existence
export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}
//#endregion
//#region read
export async function readDirectoryEntries(directoryPath: string): Promise<DirectoryEntry[]> {
  return (
    await readdir(directoryPath, {
      withFileTypes: true,
    })
  ).map((entry) => ({
    path: joinPath(directoryPath, entry.name),
    name: entry.name,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
    isSymbolicLink: entry.isSymbolicLink(),
  }));
}

export async function readTextFile(filePath: string): Promise<string> {
  return readFile(filePath, 'utf-8');
}

export async function readBuffer(filePath: string): Promise<Buffer> {
  return readFile(filePath);
}
//#endregion
//#region write
export async function ensureDirAsync(targetPath: string): Promise<void> {
  try {
    const info = await stat(targetPath);

    if (!info.isDirectory()) {
      throw new Error(`Cannot create directory over file: ${targetPath}`);
    }

    return;
  } catch (error) {
    if (!hasErrorCode(error, 'ENOENT')) {
      throw error;
    }
  }

  await mkdir(targetPath, {
    recursive: true,
  });
}
export function renamePath(source: string, destination: string): Promise<void> {
  return retryFsOperation(() => rename(source, destination));
}
export async function copyPath(
  source: string,
  destination: string,
  options: CopyPathAsyncOptions = {},
): Promise<void> {
  const info = await stat(source);

  return retryFsOperation(() =>
    cp(source, destination, {
      recursive: info.isDirectory(),
      ...options,
    }),
  );
}
export async function normalizePathPermissions(targetPath: string): Promise<void> {
  try {
    await chmod(targetPath, 0o777);
  } catch {
    // ignore
  }
}
export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await writeFile(filePath, content, 'utf8');
}
//#endregion
//#region delete
export async function removePaths(paths: readonly string[]): Promise<void> {
  await Promise.all(paths.map((targetPath) => removePathWithRetry(targetPath)));
}
export function removePathWithRetry(target: string): Promise<void> {
  return retryFsOperation(() => removePath(target));
}

export async function removePath(targetPath: string): Promise<void> {
  await rm(targetPath, {
    recursive: true,
    force: true,
  });
}

//#endregion

//#region helpers

export async function collectTsBuildInfoFiles(directory: string): Promise<string[]> {
  try {
    const entries = await readDirectoryEntries(directory);

    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = joinPath(directory, entry.name);

      if (entry.isDirectory) {
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
    logger.error(LOG_EVENTS.FILESYSTEM_IO_FS_ASYNC_FAILED, {
      metadata: {
        operation: 'collectTsBuildInfoFiles',
        directory,
        error: String(error),
      },
    });

    return [];
  }
}

//#endregion
