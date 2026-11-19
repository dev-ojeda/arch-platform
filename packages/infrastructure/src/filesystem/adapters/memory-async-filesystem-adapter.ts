import type {
  DirectoryEntry,
  FileSystemAsyncPort,
  WriteFileOptions,
} from '@arch-platform/contracts';

import { MemoryFileSystem } from '../memory/memory-filesystem.js';

export class MemoryAsyncFileSystemAdapter implements FileSystemAsyncPort {
  constructor(private readonly filesystem: MemoryFileSystem) {}

  async createTempDirectory(prefix?: string): Promise<string> {
    return this.filesystem.createTempDirectory(prefix);
  }

  async exists(targetPath: string): Promise<boolean> {
    return this.filesystem.exists(targetPath);
  }

  async createDirectory(directoryPath: string): Promise<void> {
    this.filesystem.createDirectory(directoryPath);
  }

  async remove(targetPath: string): Promise<void> {
    this.filesystem.remove(targetPath);
  }

  async read(filePath: string): Promise<string> {
    return this.filesystem.read(filePath);
  }

  async readBuffer(filePath: string): Promise<Uint8Array> {
    return this.filesystem.readBuffer(filePath);
  }

  async readDirectory(directoryPath: string): Promise<DirectoryEntry[]> {
    return this.filesystem.readDirectory(directoryPath);
  }

  async readJson<T>(filePath: string): Promise<T> {
    return this.filesystem.readJson<T>(filePath);
  }

  async write(filePath: string, content: string, options?: WriteFileOptions): Promise<void> {
    this.filesystem.write(filePath, content, options);
  }

  async writeJson<T>(filePath: string, value: T, options?: WriteFileOptions): Promise<void> {
    this.filesystem.writeJson(filePath, value, options);
  }

  async copy(source: string, destination: string): Promise<void> {
    this.filesystem.copy(source, destination);
  }

  async rename(source: string, destination: string): Promise<void> {
    this.filesystem.rename(source, destination);
  }
}
