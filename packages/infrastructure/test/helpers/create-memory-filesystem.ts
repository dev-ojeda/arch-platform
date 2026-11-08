import { posix } from 'node:path';

import type {
  DirectoryEntry,
  FileSystemAsyncPort,
  WriteFileOptions,
} from '@arch-platform/contracts';

import { safeParse } from '../../src/serialization/safe-parse.js';
import { safeStringify } from '../../src/serialization/safe-stringify.js';

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

      const fileContent = internalState.files.get(normalizedSource);

      // Copia individual de archivos.
      if (fileContent !== undefined) {
        assertPathIsNotDirectory(internalState, normalizedDestination);
        ensureParentDirectories(internalState, normalizedDestination);
        internalState.files.set(normalizedDestination, fileContent);

        return Promise.resolve();
      }

      // La fuente debe ser un directorio.
      if (!internalState.directories.has(normalizedSource)) {
        throw new Error(`Path not found: ${normalizedSource}`);
      }

      assertPathIsNotFile(internalState, normalizedDestination);

      // Copiar directorio raíz y subdirectorios.
      const directories = Array.from(internalState.directories)
        .filter(
          (directory) =>
            directory === normalizedSource || directory.startsWith(`${normalizedSource}/`),
        )
        .sort((left, right) => left.length - right.length);

      for (const directory of directories) {
        const relativePath = directory.slice(normalizedSource.length);
        const targetPath = `${normalizedDestination}${relativePath}`;

        ensureDirectoryHierarchy(internalState, targetPath);
      }

      // Copiar archivos conservando su estructura relativa.
      const files = Array.from(internalState.files.entries()).filter(([filePath]) =>
        filePath.startsWith(`${normalizedSource}/`),
      );

      for (const [filePath, content] of files) {
        const relativePath = filePath.slice(normalizedSource.length);
        const targetPath = `${normalizedDestination}${relativePath}`;

        ensureParentDirectories(internalState, targetPath);
        internalState.files.set(targetPath, content);
      }

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
          isSymbolicLink: false,
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
      const normalizedSource = resolvePath(source);
      const normalizedDestination = resolvePath(destination);

      if (normalizedSource === normalizedDestination) {
        return Promise.resolve();
      }

      const sourceFile = internalState.files.get(normalizedSource);

      if (sourceFile !== undefined) {
        assertPathIsNotDirectory(internalState, normalizedDestination);

        ensureParentDirectories(internalState, normalizedDestination);

        internalState.files.set(normalizedDestination, sourceFile);
        internalState.files.delete(normalizedSource);

        return Promise.resolve();
      }

      if (!internalState.directories.has(normalizedSource)) {
        throw new Error(`Path not found: ${normalizedSource}`);
      }

      assertPathIsNotFile(internalState, normalizedDestination);

      const sourcePrefix = `${normalizedSource}/`;

      const directories = Array.from(internalState.directories)
        .filter((directory) => directory === normalizedSource || directory.startsWith(sourcePrefix))
        .sort((left, right) => left.length - right.length);

      const files = Array.from(internalState.files.entries()).filter(([filePath]) =>
        filePath.startsWith(sourcePrefix),
      );

      ensureParentDirectories(internalState, normalizedDestination);

      for (const directory of directories) {
        const relativePath = directory.slice(normalizedSource.length);
        const targetPath = `${normalizedDestination}${relativePath}`;

        ensureDirectoryHierarchy(internalState, targetPath);
      }

      for (const [filePath, content] of files) {
        const relativePath = filePath.slice(normalizedSource.length);
        const targetPath = `${normalizedDestination}${relativePath}`;

        ensureParentDirectories(internalState, targetPath);

        internalState.files.set(targetPath, content);
      }

      internalState.directories.delete(normalizedSource);

      for (const directory of directories) {
        if (directory !== normalizedSource) {
          internalState.directories.delete(directory);
        }
      }

      for (const [filePath] of files) {
        internalState.files.delete(filePath);
      }

      return Promise.resolve();
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

function normalizePath(targetPath: string): string {
  // El flag 'g' (global) hace exactamente lo mismo que replaceAll
  return posix.normalize(targetPath.replace(/\\/g, '/'));
}
