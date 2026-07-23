// packages/testing/src/filesystem/memory-filesystem.adapter.ts

import { readdirSync, renameSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

import type { DirectoryEntry, FileSystemSyncPort, WriteFileOptions } from '@arch/contracts';

import { safeStringify } from '../helpers/safe-stringify.js';

export class MemoryFileSystemAdapter implements FileSystemSyncPort {
  readonly #files = new Map<string, string>();

  readonly #directories = new Set<string>();

  constructor() {
    this.#directories.add('/');
  }
  rename(source: string, destination: string): void {
    renameSync(source, destination);
  }
  readDirectory(directoryPath: string): DirectoryEntry[] {
    return this.readDirectoryEntriesSync(directoryPath);
  }
  ensureDir(directoryPath: string): void {
    this.createDirectory(directoryPath);
  }
  readFile(filePath: string): string {
    return this.read(filePath);
  }
  readBuffer(filePath: string): Uint8Array {
    return Buffer.from(this.readFile(filePath));
  }
  readJson<T>(filePath: string): T {
    return JSON.parse(this.read(filePath)) as T;
  }
  writeFile(filePath: string, data: string | Uint8Array, options?: WriteFileOptions): void {
    const content = typeof data === 'string' ? data : Buffer.from(data).toString('utf8');

    this.write(filePath, content, options);
  }
  writeJson(filePath: string, value: unknown): void {
    this.write(filePath, safeStringify(value, 2));
  }
  private normalizePath(targetPath: string): string {
    const normalized = normalize(targetPath).replaceAll('\\', '/');

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }

  private ensureParentDirectories(filePath: string): void {
    let current = this.normalizePath(dirname(filePath));

    while (current !== '/' && current !== '.') {
      this.#directories.add(current);

      const parent = this.normalizePath(dirname(current));

      if (parent === current) {
        break;
      }

      current = parent;
    }

    this.#directories.add('/');
  }

  private readDirectoryEntriesSync(path: string): DirectoryEntry[] {
    return readdirSync(path, {
      withFileTypes: true,
    }).map((entry) => ({
      path: join(path, entry.name),
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
      isSymbolicLink: entry.isSymbolicLink(),
    }));
  }
  read(targetPath: string): string {
    const normalized = this.normalizePath(targetPath);

    const content = this.#files.get(normalized);

    if (content === undefined) {
      throw new Error(`File not found: ${normalized}`);
    }

    return content;
  }

  write(targetPath: string, content: string, options?: WriteFileOptions): void {
    const normalized = this.normalizePath(targetPath);

    if (this.#directories.has(normalized)) {
      throw new Error(`Cannot write file over directory: ${normalized}`);
    }
    const overwrite = options?.overwrite ?? 'overwrite';

    if (this.#files.has(normalized)) {
      switch (overwrite) {
        case 'skip':
          break;
        case 'error':
          throw new Error(`File already exists: ${normalized}`);
        case 'overwrite':
        default:
          break;
      }
    }

    this.ensureParentDirectories(normalized);

    this.#files.set(normalized, content);
  }

  copy(sourcePath: string, destinationPath: string): void {
    const content = this.read(sourcePath);
    return this.write(destinationPath, content);
  }

  createDirectory(directoryPath: string): void {
    const normalized = this.normalizePath(directoryPath);

    if (this.#files.has(normalized)) {
      throw new Error(`Cannot create directory over file: ${normalized}`);
    }

    this.ensureParentDirectories(`${normalized}/placeholder`);

    this.#directories.add(normalized);
  }

  exists(targetPath: string): boolean {
    const normalized = this.normalizePath(targetPath);
    return this.#files.has(normalized) || this.#directories.has(normalized);
  }

  remove(targetPath: string): void {
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
