// packages/testing/src/filesystem/create-memory-filesystem.ts

import { posix } from 'node:path';

import type { DirectoryEntry, FileSystemAsyncPort, WriteFileOptions } from '@arch/contracts';

type MutableMemoryFilesystemState = {
  files: Map<string, string>;

  directories: Set<string>;
};

export interface MemoryFilesystemState {
  readonly files: ReadonlyMap<string, string>;

  readonly directories: ReadonlySet<string>;
}

export interface MemoryFilesystem extends FileSystemAsyncPort {
  readonly state: MemoryFilesystemState;
}

export function createMemoryFilesystem(): MemoryFilesystem {
  const internalState: MutableMemoryFilesystemState = {
    files: new Map(),
    directories: new Set(),
  };

  const state: MemoryFilesystemState = {
    files: internalState.files,
    directories: internalState.directories,
  };

  return {
    state,

    read(targetPath: string): Promise<string> {
      const normalizedPath = resolvePath(targetPath);

      const file = internalState.files.get(normalizedPath);

      if (file === undefined) {
        throw new Error(`File not found: ${normalizedPath}`);
      }

      return Promise.resolve(file);
    },

    write(targetPath: string, content: string, _options?: WriteFileOptions): Promise<void> {
      const normalizedPath = resolvePath(targetPath);

      assertPathIsNotDirectory(internalState, normalizedPath);

      ensureParentDirectories(internalState, normalizedPath);

      internalState.files.set(normalizedPath, content);

      return Promise.resolve();
    },

    copy(source: string, destination: string): Promise<void> {
      const normalizedSource = resolvePath(source);

      const normalizedDestination = resolvePath(destination);

      const content = internalState.files.get(normalizedSource);

      if (content === undefined) {
        throw new Error(`File not found: ${normalizedSource}`);
      }

      assertPathIsNotDirectory(internalState, normalizedDestination);

      ensureParentDirectories(internalState, normalizedDestination);

      internalState.files.set(normalizedDestination, content);

      return Promise.resolve();
    },

    createDirectory(targetPath: string): Promise<void> {
      const normalizedPath = resolvePath(targetPath);

      assertPathIsNotFile(internalState, normalizedPath);

      ensureDirectoryHierarchy(internalState, normalizedPath);

      return Promise.resolve();
    },

    exists(targetPath: string): Promise<boolean> {
      const normalizedPath = resolvePath(targetPath);

      return Promise.resolve(
        internalState.files.has(normalizedPath) || internalState.directories.has(normalizedPath),
      );
    },

    remove(targetPath: string): Promise<void> {
      const normalizedPath = resolvePath(targetPath);

      internalState.files.delete(normalizedPath);

      internalState.directories.delete(normalizedPath);

      removeNestedFiles(internalState, normalizedPath);

      removeNestedDirectories(internalState, normalizedPath);

      return Promise.resolve();
    },

    readDirectory(directoryPath: string): Promise<DirectoryEntry[]> {
      const normalizedDirectory = resolvePath(directoryPath);

      const fileEntries = Array.from(internalState.files.keys())
        .filter((filePath) => posix.dirname(filePath) === normalizedDirectory)
        .map<DirectoryEntry>((filePath) => ({
          name: posix.basename(filePath),
          path: filePath,
          isFile: true,
          isDirectory: false,
          isSymbolicLink: false,
        }));

      const directoryEntries = Array.from(internalState.directories.values())
        .filter(
          (directoryPath) =>
            directoryPath !== normalizedDirectory &&
            posix.dirname(directoryPath) === normalizedDirectory,
        )
        .map<DirectoryEntry>((directoryPath) => ({
          name: posix.basename(directoryPath),
          path: directoryPath,
          isFile: false,
          isDirectory: true,
          isSymbolicLink: true,
        }));

      return Promise.resolve(
        [...directoryEntries, ...fileEntries].sort((left, right) =>
          left.path.localeCompare(right.path),
        ),
      );
    },
    readJson: async function <T>(filePath: string): Promise<T> {
      return this.read(filePath).then((content: string) => safeParse<T>(content));
    },
    writeJson<T>(filePath: string, value: T, options?: WriteFileOptions): Promise<void> {
      return this.write(filePath, safeStringify(value, 2), options);
    },
    readBuffer(filePath: string): Promise<Uint8Array> {
      return this.read(filePath).then((content) => Buffer.from(content, 'utf8'));
    },
    async rename(source: string, destination: string): Promise<void> {
      await this.copy(source, destination);
      await this.remove(source);
    },
  };
}
function resolvePath(targetPath: string): string {
  const normalizedPath = normalizePath(targetPath);

  if (normalizedPath === '.' || normalizedPath === '') {
    return '/';
  }

  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
}

function ensureParentDirectories(state: MutableMemoryFilesystemState, targetPath: string): void {
  const parentDirectory = posix.dirname(targetPath);

  ensureDirectoryHierarchy(state, parentDirectory);
}

function ensureDirectoryHierarchy(
  state: MutableMemoryFilesystemState,
  directoryPath: string,
): void {
  const normalizedPath = resolvePath(directoryPath);

  if (normalizedPath === '/') {
    return;
  }

  const segments = normalizedPath.split('/');

  let currentPath = '';

  for (const segment of segments) {
    if (!segment) {
      continue;
    }

    currentPath = `${currentPath}/${segment}`;

    assertPathIsNotFile(state, currentPath);

    state.directories.add(currentPath);
  }
}

function removeNestedFiles(state: MutableMemoryFilesystemState, directoryPath: string): void {
  const filePaths = Array.from(state.files.keys());

  for (const filePath of filePaths) {
    if (filePath.startsWith(`${directoryPath}/`)) {
      state.files.delete(filePath);
    }
  }
}

function removeNestedDirectories(state: MutableMemoryFilesystemState, directoryPath: string): void {
  const directoryPaths = Array.from(state.directories.values());

  for (const existingDirectory of directoryPaths) {
    if (existingDirectory.startsWith(`${directoryPath}/`)) {
      state.directories.delete(existingDirectory);
    }
  }
}

function assertPathIsNotFile(state: MutableMemoryFilesystemState, targetPath: string): void {
  if (state.files.has(targetPath)) {
    throw new Error(`Cannot create directory over file: ${targetPath}`);
  }
}

function assertPathIsNotDirectory(state: MutableMemoryFilesystemState, targetPath: string): void {
  if (state.directories.has(targetPath)) {
    throw new Error(`Cannot write file over directory: ${targetPath}`);
  }
}
function safeStringify(value: unknown, space?: number): string {
  const seen = new WeakSet<object>();

  const replacer = (_key: string, currentValue: unknown): unknown => {
    if (currentValue instanceof Error) {
      return {
        name: currentValue.name,
        message: currentValue.message,
        stack: currentValue.stack,
      };
    }

    if (typeof currentValue === 'bigint') {
      return currentValue.toString();
    }

    if (typeof currentValue === 'undefined') {
      return '[undefined]';
    }

    if (typeof currentValue === 'symbol') {
      return currentValue.toString();
    }

    if (currentValue instanceof Map) {
      return Object.fromEntries(currentValue);
    }

    if (currentValue instanceof Set) {
      return [...currentValue];
    }

    if (typeof currentValue === 'object' && currentValue !== null) {
      if (seen.has(currentValue)) {
        return '[Circular]';
      }

      seen.add(currentValue);
    }

    return currentValue;
  };

  try {
    return JSON.stringify(value, replacer, space);
  } catch {
    return '[unserializable]';
  }
}

function safeParse<T>(content: string): T {
  return JSON.parse(content) as T;
}
function normalizePath(targetPath: string): string {
  return posix.normalize(targetPath.replaceAll('\\', '/'));
}
