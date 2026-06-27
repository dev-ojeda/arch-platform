// packages/build-core/src/fs/fs-async.ts

import type { Dirent } from 'node:fs';
import { access, cp, mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';

import { safeParse, safeStringify } from '../serialization/safe-stringify.js';

export type CopyPathOptions = Parameters<typeof cp>[2];
export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);

    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(targetPath: string): Promise<void> {
  await mkdir(targetPath, {
    recursive: true,
  });
}

export async function copyPath(
  source: string,
  destination: string,
  options: CopyPathOptions = {},
): Promise<void> {
  await cp(source, destination, options);
}

export async function removePath(targetPath: string): Promise<void> {
  await rm(targetPath, {
    recursive: true,
    force: true,
  });
}

export async function renamePath(source: string, destination: string): Promise<void> {
  await rename(source, destination);
}

export async function readDirectoryEntries(directoryPath: string): Promise<Dirent[]> {
  return readdir(directoryPath, {
    withFileTypes: true,
  });
}
export async function readTextFile(filePath: string): Promise<string> {
  return readFile(filePath, 'utf-8');
}

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await writeFile(filePath, content, 'utf-8');
}
export async function readBuffer(filePath: string): Promise<Buffer> {
  return readFile(filePath);
}

export async function readJsonFile(filePath: string): Promise<unknown> {
  const content = await readTextFile(filePath);

  return safeParse(content);
}

export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await writeTextFile(filePath, safeStringify(value, 2));
}
