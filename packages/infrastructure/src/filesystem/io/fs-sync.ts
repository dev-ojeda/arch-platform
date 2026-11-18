// packages/infrastructure/src/filesystem/io/fs-sync.ts

import {
  appendFileSync,
  cpSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
  type CopySyncOptions,
  type Stats,
} from 'node:fs';

import type { DirectoryEntry } from '@arch-platform/contracts';

import { joinPath } from './path-utils.js';
import { safeParse } from '../../serialization/safe-parse.js';
import { hasErrorCode } from '../errors/errno-utils.js';

//#region existence
/**
 * Returns true when a filesystem path exists.
 *
 * Supports:
 * - files
 * - directories
 * - symbolic links, including broken symbolic links
 */
export function pathExistsSync(targetPath: string): boolean {
  try {
    lstatSync(targetPath);
    return true;
  } catch (error) {
    if (hasErrorCode(error, 'ENOENT')) {
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
  } catch (error) {
    if (hasErrorCode(error, 'ENOENT', 'ENOTDIR')) {
      return false;
    }

    throw error;
  }
}
export function isFile(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (error) {
    if (hasErrorCode(error, 'ENOENT', 'ENOTDIR')) {
      return false;
    }

    throw error;
  }
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
export function createTempDirectorySync(prefix: string): string {
  return mkdtempSync(prefix);
}
export function ensureDirSync(targetPath: string): void {
  try {
    const info = statSync(targetPath);

    if (!info.isDirectory()) {
      throw new Error(`Cannot create directory over file: ${targetPath}`);
    }

    return;
  } catch (error) {
    if (!hasErrorCode(error, 'ENOENT')) {
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
export function appendTextFileSync(filePath: string, content: string): void {
  appendFileSync(filePath, content, 'utf8');
}
export function copyPathSync(
  source: string,
  destination: string,
  options: CopySyncOptions = {},
): void {
  const info = statSync(source);

  cpSync(source, destination, {
    recursive: info.isDirectory(),
    ...options,
  });
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
