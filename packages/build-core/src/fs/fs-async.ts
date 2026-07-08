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
export async function removePathWithRetry(target: string, retries = 5, delay = 100): Promise<void> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await removePath(target);
      return;
    } catch (error: unknown) {
      if (!isRetryableFsError(error)) {
        throw error;
      }

      await sleep(delay * (attempt + 1));
    }
  }

  await removePath(target);
}
export async function copyPath(
  source: string,
  destination: string,
  options: CopyPathOptions = {},
): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await cp(source, destination, options);
      return;
    } catch (error: unknown) {
      if (!isRetryableFsError(error)) {
        throw error;
      }

      await sleep(50 * (attempt + 1));
    }
  }

  await cp(source, destination, options);
}

export async function removePath(targetPath: string): Promise<void> {
  await rm(targetPath, {
    recursive: true,
    force: true,
  });
}

function isRetryableFsError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'EBUSY' || error.code === 'EPERM' || error.code === 'EACCES')
  );
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function renamePath(source: string, destination: string): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await rename(source, destination);
      return;
    } catch (error) {
      lastError = error;

      await new Promise((r) => setTimeout(r, 20 * (attempt + 1)));
    }
  }

  throw lastError;
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
