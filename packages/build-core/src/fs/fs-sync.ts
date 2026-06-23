// packages/build-core/src/fs/fs-sync.ts

import fs, { lstatSync, type Stats } from 'node:fs';

import { safeParse, safeStringify } from '../serialization/safe-stringify.js';

//#region existence
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
  return fs.statSync(filePath).size;
}

export function isDirectory(path: string): boolean {
  try {
    return lstatSync(path).isDirectory();
  } catch {
    return false;
  }
}
export function isFile(filePath: string): boolean {
  return fs.statSync(filePath).isFile();
}
export function tryFileSize(filePath: string): number | undefined {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return undefined;
  }
}
//#endregion

//#region read
export function readTextFileSync(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}
export function readBufferSync(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}
export function readNormalizedTextFileSync(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}
export function readDirectoryEntriesSync(path: string): fs.Dirent[] {
  return fs.readdirSync(path, {
    withFileTypes: true,
  });
}
export function readJsonFileSync(filePath: string): unknown {
  return safeParse(readTextFileSync(filePath));
}

//#endregion

//#region write
export function writeTextFileSync(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf-8');
}
export function ensureDirSync(dirPath: string): void {
  fs.mkdirSync(dirPath, {
    recursive: true,
  });
}
export function writeJsonFileSync(filePath: string, value: unknown): void {
  writeTextFileSync(filePath, safeStringify(value, 2));
}
//#endregion

//#region delete
export function removePathSync(targetPath: string): void {
  fs.rmSync(targetPath, {
    recursive: true,
    force: true,
  });
}
//#endregion
