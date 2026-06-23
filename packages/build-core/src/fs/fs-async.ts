// packages/build-core/src/fs/fs-async.ts

import type { Dirent } from 'node:fs';
import fs from 'node:fs/promises';

import { safeParse, safeStringify } from '../serialization/safe-stringify.js';

export type CopyPathOptions = Parameters<typeof fs.cp>[2];
export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);

    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(targetPath: string): Promise<void> {
  await fs.mkdir(targetPath, {
    recursive: true,
  });
}

export async function copyPath(
  source: string,
  destination: string,
  options: CopyPathOptions = {},
): Promise<void> {
  await fs.cp(source, destination, options);
}

export async function removePath(targetPath: string): Promise<void> {
  await fs.rm(targetPath, {
    recursive: true,
    force: true,
  });
}

export async function renamePath(source: string, destination: string): Promise<void> {
  await fs.rename(source, destination);
}

export async function readDirectoryEntries(directoryPath: string): Promise<Dirent[]> {
  return fs.readdir(directoryPath, {
    withFileTypes: true,
  });
}
export async function readTextFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8');
}
export async function readBuffer(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}

export async function readJsonFile(filePath: string): Promise<unknown> {
  const content = await readTextFile(filePath);

  return safeParse(content);
}

export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await writeTextFile(filePath, safeStringify(value, 2));
}
