// packages/testing/src/filesystem/create-memory-filesystem.ts

import path from 'node:path';

import type { DirectoryEntry, FileSystemPort, WriteFileOptions } from '@arch/contracts/filesystem';

import { normalizePath } from '../utils/normalize-path.js';

type MutableMemoryFilesystemState = {
  files: Map<string, string>;

  directories: Set<string>;
};

export interface MemoryFilesystemState {
  readonly files: ReadonlyMap<string, string>;

  readonly directories: ReadonlySet<string>;
}

export interface MemoryFilesystem extends FileSystemPort {
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
        .filter((filePath) => path.posix.dirname(filePath) === normalizedDirectory)
        .map<DirectoryEntry>((filePath) => ({
          name: path.posix.basename(filePath),
          path: filePath,
          isDirectory: false,
        }));

      const directoryEntries = Array.from(internalState.directories.values())
        .filter(
          (directoryPath) =>
            directoryPath !== normalizedDirectory &&
            path.posix.dirname(directoryPath) === normalizedDirectory,
        )
        .map<DirectoryEntry>((directoryPath) => ({
          name: path.posix.basename(directoryPath),
          path: directoryPath,
          isDirectory: true,
        }));

      return Promise.resolve(
        [...directoryEntries, ...fileEntries].sort((left, right) =>
          left.path.localeCompare(right.path),
        ),
      );
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
  const parentDirectory = path.posix.dirname(targetPath);

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
