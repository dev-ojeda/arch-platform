// packages/infrastructure/src/filesystem/io/fs-sync.ts

import {
  cpSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
  type CopySyncOptions,
  type Stats,
} from 'node:fs';

import type { DirectoryEntry } from '@arch/contracts';

import { safeParse } from '../../serialization/safe-stringify.js';

import { joinPath } from './path-utils.js';

//#region existence
/**
 * Returns true when a filesystem path exists.
 *
 * Supports:
 * - files
 * - directories
 * - valid symlinks
 */
export function pathExistsSync(targetPath: string): boolean {
  try {
    lstatSync(targetPath);
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}
//#endregion

//#region metadata
export function getPathStatSync(targetPath: string): Stats {
  return lstatSync(targetPath);
}
export function fileSizeSync(filePath: string): number {
  return statSync(filePath).size;
}

export function isDirectory(path: string): boolean {
  try {
    return lstatSync(path).isDirectory();
  } catch {
    return false;
  }
}
export function isFile(filePath: string): boolean {
  return statSync(filePath).isFile();
}
export function tryFileSize(filePath: string): number | undefined {
  try {
    return statSync(filePath).size;
  } catch {
    return undefined;
  }
}

//#endregion

//#region read
export function readTextFileSync(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}
export function readBufferSync(filePath: string): Buffer {
  return readFileSync(filePath);
}
export function readNormalizedTextFileSync(filePath: string): string {
  return readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}
export function readDirectoryEntriesSync(path: string): DirectoryEntry[] {
  return readdirSync(path, {
    withFileTypes: true,
  }).map((entry) => ({
    path: joinPath(path, entry.name),
    name: entry.name,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
    isSymbolicLink: entry.isSymbolicLink(),
  }));
}
export function readJsonFileSync<T>(filePath: string): T {
  const content = readTextFileSync(filePath);
  return safeParse<T>(content);
}
//#endregion

//#region write

export function ensureDirSync(targetPath: string): void {
  try {
    const info = statSync(targetPath);

    if (!info.isDirectory()) {
      throw new Error(`Cannot create directory over file: ${targetPath}`);
    }

    return;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      throw error;
    }
  }

  mkdirSync(targetPath, {
    recursive: true,
  });
}

export function writeTextFileSync(filePath: string, data: string | Uint8Array): void {
  writeFileSync(filePath, data);
}
export function copyPathSync(
  source: string,
  destination: string,
  options: CopySyncOptions = {},
): void {
  if (pathExistsSync(destination)) {
    const stat = statSync(destination);
    console.debug('fs-sync: copyPathSync - destination state', {
      exists: true,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile(),
    });
  } else {
    console.log({
      exists: false,
    });
  }

  cpSync(source, destination, options);
}
export function renamePathSync(source: string, destination: string): void {
  renameSync(source, destination);
}
//#endregion

//#region delete
export function removePathSync(targetPath: string): void {
  rmSync(targetPath, {
    recursive: true,
    force: true,
  });
}

//#endregion
