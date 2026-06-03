// packages/core/src/filesystem/memory-filesystem.adapter.ts

import path from 'node:path';

import type { DirectoryEntry, FileSystemPort, WriteFileOptions } from '@arch/contracts/filesystem';

export class MemoryFileSystemAdapter implements FileSystemPort {
  private readonly files = new Map<string, string>();

  private readonly directories = new Set<string>();

  private normalizePath(targetPath: string): string {
    return path.normalize(targetPath).replaceAll('\\', '/');
  }

  read(targetPath: string): Promise<string> {
    const normalized = this.normalizePath(targetPath);

    const content = this.files.get(normalized);

    if (content === undefined) {
      throw new Error(`File not found: ${normalized}`);
    }

    return Promise.resolve(content);
  }

  write(targetPath: string, content: string, options?: WriteFileOptions): Promise<void> {
    const normalized = this.normalizePath(targetPath);

    const exists = this.files.has(normalized);

    const overwrite = options?.overwrite ?? 'overwrite';

    if (exists) {
      switch (overwrite) {
        case 'skip':
          return Promise.resolve();

        case 'error':
          throw new Error(`File already exists: ${normalized}`);

        case 'overwrite':
        default:
          break;
      }
    }

    this.files.set(normalized, content);

    this.directories.add(path.dirname(normalized));

    return Promise.resolve();
  }

  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    const content = await this.read(sourcePath);

    return this.write(destinationPath, content);
  }

  createDirectory(targetPath: string): Promise<void> {
    this.directories.add(this.normalizePath(targetPath));

    return Promise.resolve();
  }

  exists(targetPath: string): Promise<boolean> {
    const normalized = this.normalizePath(targetPath);

    return Promise.resolve(this.files.has(normalized) || this.directories.has(normalized));
  }

  remove(targetPath: string): Promise<void> {
    const normalized = this.normalizePath(targetPath);

    this.files.delete(normalized);

    this.directories.delete(normalized);

    return Promise.resolve();
  }

  readDirectory(directoryPath: string): Promise<DirectoryEntry[]> {
    const normalized = this.normalizePath(directoryPath);

    const prefix = normalized.endsWith('/') ? normalized : `${normalized}/`;

    const entries: DirectoryEntry[] = [];

    for (const filePath of this.files.keys()) {
      if (!filePath.startsWith(prefix)) {
        continue;
      }

      entries.push({
        name: filePath.split('/').pop() ?? '',

        path: filePath,

        isDirectory: false,
      });
    }

    return Promise.resolve(entries);
  }

  getFiles(): Record<string, string> {
    return Object.fromEntries(this.files.entries());
  }

  clear(): void {
    this.files.clear();

    this.directories.clear();
  }
}
