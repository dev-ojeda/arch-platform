// packages\infrastructure\src\filesystem\memory-filesystem.adapter.ts
import * as path from 'node:path';

import type { DirectoryEntry, FileSystemPort, WriteFileOptions } from '@arch/contracts';

export class MemoryFileSystemAdapter implements FileSystemPort {
  private readonly files = new Map<string, string>();

  private readonly directories = new Set<string>();

  private normalizePath(targetPath: string): string {
    return path.normalize(targetPath).replaceAll('\\', '/');
  }

  async read(targetPath: string): Promise<string> {
    const normalized = this.normalizePath(targetPath);

    const file = this.files.get(normalized);

    if (file === undefined) {
      throw new Error(`File not found: ${normalized}`);
    }

    return file;
  }

  async write(
    targetPath: string,

    content: string,

    options?: WriteFileOptions,
  ): Promise<void> {
    const normalized = this.normalizePath(targetPath);

    const exists = this.files.has(normalized);

    const overwrite = options?.overwrite ?? 'overwrite';

    if (exists) {
      switch (overwrite) {
        case 'skip':
          return;

        case 'error':
          throw new Error(`File already exists: ${normalized}`);

        case 'overwrite':
        default:
          break;
      }
    }

    this.files.set(normalized, content);

    this.directories.add(path.dirname(normalized));
  }

  async copy(source: string, destination: string): Promise<void> {
    const content = await this.read(source);

    await this.write(destination, content);
  }

  async createDirectory(targetPath: string): Promise<void> {
    this.directories.add(this.normalizePath(targetPath));
  }

  async exists(targetPath: string): Promise<boolean> {
    const normalized = this.normalizePath(targetPath);

    return this.files.has(normalized) || this.directories.has(normalized);
  }

  async remove(targetPath: string): Promise<void> {
    const normalized = this.normalizePath(targetPath);

    this.files.delete(normalized);

    this.directories.delete(normalized);
  }

  async readDirectory(directoryPath: string): Promise<DirectoryEntry[]> {
    const normalized = this.normalizePath(directoryPath);

    const entries: DirectoryEntry[] = [];

    for (const filePath of this.files.keys()) {
      if (!filePath.startsWith(normalized)) {
        continue;
      }

      entries.push({
        name: filePath.split('/').pop() ?? '',

        path: filePath,

        isDirectory: false,
      });
    }

    return entries;
  }

  getFiles(): Record<string, string> {
    return Object.fromEntries(this.files.entries());
  }

  clear(): void {
    this.files.clear();

    this.directories.clear();
  }
}
