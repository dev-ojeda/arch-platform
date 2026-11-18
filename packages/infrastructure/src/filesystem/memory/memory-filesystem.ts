import type {
  DirectoryEntry,
  FileSystemSyncPort,
  WriteFileOptions,
} from '@arch-platform/contracts';

import type { MemoryFileSystemState } from './memory-filesystem-state.js';
import { safeParse } from '../../serialization/safe-parse.js';
import { safeStringify } from '../../serialization/safe-stringify.js';
import { PosixPathService } from '../paths/posix-path-service.js';
import { shouldWriteFile } from '../policies/resolve-write-policy.js';

type MutableMemoryFilesystemState = {
  files: Map<string, string>;

  directories: Set<string>;
};

export class MemoryFileSystem implements FileSystemSyncPort {
  constructor(private readonly posixPathService = new PosixPathService()) {}
  private readonly internalState: MutableMemoryFilesystemState = {
    files: new Map(),
    directories: new Set(),
  };
  private tempCounter = 0;

  get state(): MemoryFileSystemState {
    return {
      files: this.internalState.files,
      directories: this.internalState.directories,
    };
  }

  private ensureParentDirectories(targetPath: string): void {
    const parentDirectory = this.posixPathService.dirname(targetPath);

    this.ensureDirectoryHierarchy(parentDirectory);
  }

  private ensureDirectoryHierarchy(directoryPath: string): void {
    const normalizedPath = this.posixPathService.normalize(directoryPath);

    if (normalizedPath === '/') {
      return;
    }

    const segments = normalizedPath.split('/');
    let currentPath = '';

    for (const segment of segments) {
      if (!segment) continue;

      currentPath = `${currentPath}/${segment}`;

      this.assertPathIsNotFile(currentPath);
      this.internalState.directories.add(currentPath);
    }
  }

  private assertPathIsNotFile(targetPath: string): void {
    if (this.internalState.files.has(targetPath)) {
      throw new Error(`Cannot create directory over file: ${targetPath}`);
    }
  }

  private assertPathIsNotDirectory(targetPath: string): void {
    if (this.internalState.directories.has(targetPath)) {
      throw new Error(`Cannot write file over directory: ${targetPath}`);
    }
  }

  private removeNestedFiles(directoryPath: string): void {
    for (const filePath of this.internalState.files.keys()) {
      if (filePath.startsWith(`${directoryPath}/`)) {
        this.internalState.files.delete(filePath);
      }
    }
  }

  private removeNestedDirectories(directoryPath: string): void {
    for (const existingDirectory of this.internalState.directories) {
      if (existingDirectory.startsWith(`${directoryPath}/`)) {
        this.internalState.directories.delete(existingDirectory);
      }
    }
  }

  copy(sourcePath: string, destinationPath: string): void {
    const normalizedSource = this.posixPathService.resolve(sourcePath);
    const normalizedDestination = this.posixPathService.resolve(destinationPath);

    const fileContent = this.internalState.files.get(normalizedSource);

    // Copia individual de archivos.
    if (fileContent !== undefined) {
      this.assertPathIsNotDirectory(normalizedDestination);
      this.ensureParentDirectories(normalizedDestination);
      this.internalState.files.set(normalizedDestination, fileContent);
      return;
    }

    // La fuente debe ser un directorio.
    if (!this.internalState.directories.has(normalizedSource)) {
      throw new Error(`Path not found: ${normalizedSource}`);
    }

    this.assertPathIsNotFile(normalizedDestination);

    // Copiar directorio raíz y subdirectorios.
    const directories = Array.from(this.internalState.directories)
      .filter(
        (directory) =>
          directory === normalizedSource || directory.startsWith(`${normalizedSource}/`),
      )
      .sort((left, right) => left.length - right.length);

    for (const directory of directories) {
      const relativePath = directory.slice(normalizedSource.length);
      const targetPath = `${normalizedDestination}${relativePath}`;

      this.ensureDirectoryHierarchy(targetPath);
    }

    // Copiar archivos conservando su estructura relativa.
    const files = Array.from(this.internalState.files.entries()).filter(([filePath]) =>
      filePath.startsWith(`${normalizedSource}/`),
    );

    for (const [filePath, content] of files) {
      const relativePath = filePath.slice(normalizedSource.length);
      const targetPath = `${normalizedDestination}${relativePath}`;

      this.ensureParentDirectories(targetPath);
      this.internalState.files.set(targetPath, content);
    }

    return;
  }

  createDirectory(directoryPath: string): void {
    const normalizedPath = this.posixPathService.resolve(directoryPath);

    this.assertPathIsNotFile(normalizedPath);

    this.ensureDirectoryHierarchy(normalizedPath);

    return;
  }

  createTempDirectory(prefix = 'tmp-'): string {
    const normalizedSeparators = prefix.replaceAll('\\', '/');
    const isDirectoryTarget = normalizedSeparators === '' || normalizedSeparators.endsWith('/');

    const safePrefix = isDirectoryTarget ? `${normalizedSeparators}tmp-` : normalizedSeparators;

    const resolvedPrefix = this.posixPathService.resolve(safePrefix);

    let uniquePath: string;

    do {
      this.tempCounter += 1;

      const suffix = this.tempCounter.toString(36).padStart(6, '0');
      uniquePath = `${resolvedPrefix}${suffix}`;
    } while (
      this.internalState.directories.has(uniquePath) ||
      this.internalState.files.has(uniquePath)
    );

    this.assertPathIsNotFile(uniquePath);
    this.ensureDirectoryHierarchy(uniquePath);

    return uniquePath;
  }
  exists(targetPath: string): boolean {
    const normalizedPath = this.posixPathService.resolve(targetPath);

    return (
      this.internalState.files.has(normalizedPath) ||
      this.internalState.directories.has(normalizedPath)
    );
  }

  remove(targetPath: string): void {
    const normalizedPath = this.posixPathService.resolve(targetPath);

    this.internalState.files.delete(normalizedPath);
    this.internalState.directories.delete(normalizedPath);

    this.removeNestedFiles(normalizedPath);
    this.removeNestedDirectories(normalizedPath);
  }

  read(filePath: string): string {
    const normalizedPath = this.posixPathService.resolve(filePath);

    const file = this.internalState.files.get(normalizedPath);

    if (file === undefined) {
      throw new Error(`File not found: ${normalizedPath}`);
    }

    return file;
  }

  readBuffer(filePath: string): Uint8Array {
    return Buffer.from(this.read(filePath), 'utf8');
  }

  readJson<T>(filePath: string): T {
    return safeParse<T>(this.read(filePath));
  }

  readDirectory(directoryPath: string): DirectoryEntry[] {
    const normalizedDirectory = this.posixPathService.resolve(directoryPath);

    const fileEntries = Array.from(this.internalState.files.keys())
      .filter((filePath) => this.posixPathService.dirname(filePath) === normalizedDirectory)
      .map<DirectoryEntry>((filePath) => ({
        name: this.posixPathService.basename(filePath),
        path: filePath,
        isFile: true,
        isDirectory: false,
        isSymbolicLink: false,
      }));

    const directoryEntries = Array.from(this.internalState.directories.values())
      .filter(
        (directoryPath) =>
          directoryPath !== normalizedDirectory &&
          this.posixPathService.dirname(directoryPath) === normalizedDirectory,
      )
      .map<DirectoryEntry>((directoryPath) => ({
        name: this.posixPathService.basename(directoryPath),
        path: directoryPath,
        isFile: false,
        isDirectory: true,
        isSymbolicLink: false,
      }));

    return [...directoryEntries, ...fileEntries].sort((left, right) =>
      left.path.localeCompare(right.path),
    );
  }

  rename(source: string, destination: string): void {
    const normalizedSource = this.posixPathService.resolve(source);
    const normalizedDestination = this.posixPathService.resolve(destination);

    if (normalizedSource === normalizedDestination) {
      return;
    }

    const sourceFile = this.internalState.files.get(normalizedSource);

    if (sourceFile !== undefined) {
      this.assertPathIsNotDirectory(normalizedDestination);

      this.ensureParentDirectories(normalizedDestination);

      this.internalState.files.set(normalizedDestination, sourceFile);
      this.internalState.files.delete(normalizedSource);

      return;
    }

    if (!this.internalState.directories.has(normalizedSource)) {
      throw new Error(`Path not found: ${normalizedSource}`);
    }

    this.assertPathIsNotFile(normalizedDestination);

    const sourcePrefix = `${normalizedSource}/`;

    const directories = Array.from(this.internalState.directories)
      .filter((directory) => directory === normalizedSource || directory.startsWith(sourcePrefix))
      .sort((left, right) => left.length - right.length);

    const files = Array.from(this.internalState.files.entries()).filter(([filePath]) =>
      filePath.startsWith(sourcePrefix),
    );

    this.ensureParentDirectories(normalizedDestination);

    for (const directory of directories) {
      const relativePath = directory.slice(normalizedSource.length);
      const targetPath = `${normalizedDestination}${relativePath}`;

      this.ensureDirectoryHierarchy(targetPath);
    }

    for (const [filePath, content] of files) {
      const relativePath = filePath.slice(normalizedSource.length);
      const targetPath = `${normalizedDestination}${relativePath}`;

      this.ensureParentDirectories(targetPath);

      this.internalState.files.set(targetPath, content);
    }

    this.internalState.directories.delete(normalizedSource);

    for (const directory of directories) {
      if (directory !== normalizedSource) {
        this.internalState.directories.delete(directory);
      }
    }

    for (const [filePath] of files) {
      this.internalState.files.delete(filePath);
    }

    return;
  }

  write(filePath: string, content: string, options?: WriteFileOptions): void {
    const policy = options?.overwrite ?? 'overwrite';
    const normalizedPath = this.posixPathService.resolve(filePath);

    this.assertPathIsNotDirectory(normalizedPath);

    const exists = this.internalState.files.has(normalizedPath);

    if (!shouldWriteFile(exists, options)) {
      return;
    }

    this.ensureParentDirectories(normalizedPath);

    if (policy === 'append') {
      const currentContent = this.internalState.files.get(normalizedPath) ?? '';

      this.internalState.files.set(normalizedPath, currentContent + content);
      return;
    }

    this.internalState.files.set(normalizedPath, content);
  }

  writeJson<T>(filePath: string, value: T, options?: WriteFileOptions): void {
    return this.write(filePath, safeStringify(value, 2), options);
  }
}
