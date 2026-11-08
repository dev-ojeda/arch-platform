// packages/infrastructure/src/filesystem/io/fs-async.ts

import { access, cp, mkdir, readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';

import { rimraf } from 'rimraf';

import type { DirectoryEntry } from '@arch-platform/contracts';

import { joinPath } from './path-utils.js';
import { retryFsOperation } from './retry-fs-operation.js';
import { hasErrorCode } from '../errors/errno-utils.js';

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

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await writeFile(filePath, content, 'utf8');
}
//#endregion
//#region delete
export async function removePaths(paths: readonly string[]): Promise<void> {
  await removePathsByRimraf(paths);
}
export function removePathWithRetry(target: string): Promise<void> {
  return retryFsOperation(() => removePath(target));
}

export async function removePath(targetPath: string): Promise<void> {
  // rimraf maneja nativamente la recursividad y fuerza el borrado de archivos ocultos/bloqueados
  await rimraf(targetPath, {
    preserveRoot: true,
    glob: false,
  });
}

//#endregion

//#region helpers

/**
 * Remueve una lista de rutas físicas del SSD de forma ultra rápida y segura
 */
export async function removePathsByRimraf(paths: readonly string[]): Promise<void> {
  await Promise.all(
    paths.map((path) =>
      rimraf(path, {
        preserveRoot: true,
        glob: false,
      }),
    ),
  );
}
//#endregion
