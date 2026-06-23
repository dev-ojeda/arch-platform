// packages/infrastructure/src/filesystem/memory-filesystem.adapter.ts

import path from 'node:path';

import type { DirectoryEntry, FileSystemPort, WriteFileOptions } from '@arch/contracts';

export class MemoryFileSystemAdapter implements FileSystemPort {
  readonly #files = new Map<string, string>();

  readonly #directories = new Set<string>();

  constructor() {
    this.#directories.add('/');
  }

  private normalizePath(targetPath: string): string {
    const normalized = path.normalize(targetPath).replaceAll('\\', '/');

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }

  private ensureParentDirectories(filePath: string): void {
    let current = this.normalizePath(path.dirname(filePath));

    while (current !== '/' && current !== '.') {
      this.#directories.add(current);

      const parent = this.normalizePath(path.dirname(current));

      if (parent === current) {
        break;
      }

      current = parent;
    }

    this.#directories.add('/');
  }

  read(targetPath: string): Promise<string> {
    const normalized = this.normalizePath(targetPath);

    const content = this.#files.get(normalized);

    if (content === undefined) {
      return Promise.reject(new Error(`File not found: ${normalized}`));
    }

    return Promise.resolve(content);
  }

  write(targetPath: string, content: string, options?: WriteFileOptions): Promise<void> {
    const normalized = this.normalizePath(targetPath);

    if (this.#directories.has(normalized)) {
      return Promise.reject(new Error(`Cannot write file over directory: ${normalized}`));
    }
    const overwrite = options?.overwrite ?? 'overwrite';

    if (this.#files.has(normalized)) {
      switch (overwrite) {
        case 'skip':
          return Promise.resolve();

        case 'error':
          return Promise.reject(new Error(`File already exists: ${normalized}`));

        case 'overwrite':
        default:
          break;
      }
    }

    this.ensureParentDirectories(normalized);

    this.#files.set(normalized, content);

    return Promise.resolve();
  }

  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    const content = await this.read(sourcePath);
    return await this.write(destinationPath, content);
  }

  createDirectory(directoryPath: string): Promise<void> {
    const normalized = this.normalizePath(directoryPath);

    if (this.#files.has(normalized)) {
      return Promise.reject(new Error(`Cannot create directory over file: ${normalized}`));
    }

    this.ensureParentDirectories(`${normalized}/placeholder`);

    this.#directories.add(normalized);

    return Promise.resolve();
  }

  exists(targetPath: string): Promise<boolean> {
    const normalized = this.normalizePath(targetPath);
    return Promise.resolve(this.#files.has(normalized) || this.#directories.has(normalized));
  }

  remove(targetPath: string): Promise<void> {
    const normalized = this.normalizePath(targetPath);

    const prefix = `${normalized}/`;

    this.#files.delete(normalized);
    this.#directories.delete(normalized);

    for (const filePath of [...this.#files.keys()]) {
      if (filePath.startsWith(prefix)) {
        this.#files.delete(filePath);
      }
    }

    for (const directoryPath of [...this.#directories]) {
      if (directoryPath.startsWith(prefix)) {
        this.#directories.delete(directoryPath);
      }
    }

    return Promise.resolve();
  }

  readDirectory(directoryPath: string): Promise<DirectoryEntry[]> {
    const normalized = this.normalizePath(directoryPath);

    const entries: DirectoryEntry[] = [];

    for (const directory of this.#directories) {
      if (directory !== normalized && path.dirname(directory) === normalized) {
        entries.push({
          name: path.basename(directory),
          path: directory,
          isDirectory: true,
        });
      }
    }

    for (const filePath of this.#files.keys()) {
      if (path.dirname(filePath) !== normalized) {
        continue;
      }

      entries.push({
        name: path.basename(filePath),
        path: filePath,
        isDirectory: false,
      });
    }
    return Promise.resolve(entries.sort((a, b) => a.path.localeCompare(b.path)));
  }

  getFiles(): Record<string, string> {
    return Object.fromEntries(this.#files);
  }

  clear(): void {
    this.#files.clear();

    this.#directories.clear();

    this.#directories.add('/');
  }
}
