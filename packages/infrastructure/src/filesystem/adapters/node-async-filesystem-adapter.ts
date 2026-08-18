// packages/infrastructure/src/filesystem/adapters/node-async-filesystem-adapter.ts

import type { DirectoryEntry, FileSystemAsyncPort, WriteFileOptions } from '@arch/contracts';

import { safeParse, safeStringify } from '../../serialization/safe-stringify.js';
import {
  copyPath,
  ensureDirAsync,
  pathExists,
  readBuffer,
  readDirectoryEntries,
  readTextFile,
  removePathWithRetry,
  renamePath,
  writeTextFile,
} from '../io/fs-async.js';
import { DEFAULT_FILE_SYSTEM_OPTIONS } from '../options/default-filesystem-option.js';
import type { FileSystemAdapterOptions } from '../options/filesystem-options.js';
import { normalizeDirectoryEntry } from '../paths/canonicalize-directory-entry.js';
import { NodePathService } from '../paths/node-path-service.js';
import { shouldWriteFile } from '../policies/resolve-write-policy.js';

import { BaseFileSystemAdapter } from './base-filesystem-adapter.js';

export class NodeAsyncFileSystemAdapter
  extends BaseFileSystemAdapter
  implements FileSystemAsyncPort
{
  constructor(options: FileSystemAdapterOptions = DEFAULT_FILE_SYSTEM_OPTIONS) {
    super(
      'NodeAsyncFileSystemAdapter',
      options.root ?? DEFAULT_FILE_SYSTEM_OPTIONS.root,
      new NodePathService(),
    );
  }
  async readJson<T>(filePath: string): Promise<T> {
    return safeParse<T>(await this.read(filePath));
  }
  async writeJson<T>(filePath: string, value: T, options?: WriteFileOptions): Promise<void> {
    await this.write(filePath, safeStringify(value, 2), options);
  }
  readBuffer(filePath: string): Promise<Uint8Array> {
    return readBuffer(this.resolvePath(filePath));
  }

  async read(filePath: string): Promise<string> {
    const resolvedPath = this.resolvePath(filePath);

    try {
      return await readTextFile(resolvedPath);
    } catch (error) {
      this.logAndThrow(error, 'read');
    }
  }
  async write(filePath: string, content: string, options?: WriteFileOptions): Promise<void> {
    const exists = await this.exists(filePath);

    if (!shouldWriteFile(exists, options)) {
      return;
    }

    try {
      await this.createDirectory(this.resolveParentDirectory(filePath));

      await writeTextFile(this.resolvePath(filePath), content);
    } catch (error) {
      this.logAndThrow(error, 'write');
    }
  }
  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      const source = this.resolvePath(sourcePath);
      const destination = this.resolvePath(destinationPath);

      await this.createDirectory(this.pathService.dirname(destination));

      await copyPath(source, destination);
    } catch (error) {
      this.logAndThrow(error, 'copy');
    }
  }
  async createDirectory(path: string): Promise<void> {
    try {
      await ensureDirAsync(this.resolvePath(path));
    } catch (error) {
      this.logAndThrow(error, 'createDirectory');
    }
  }

  async exists(path: string): Promise<boolean> {
    return pathExists(this.resolvePath(path));
  }

  async remove(targetPath: string): Promise<void> {
    try {
      await removePathWithRetry(this.resolvePath(targetPath));
    } catch (error) {
      this.logAndThrow(error, 'remove');
    }
  }

  async readDirectory(directoryPath: string): Promise<DirectoryEntry[]> {
    const realPath = this.resolvePath(directoryPath);

    const entries = await readDirectoryEntries(realPath);

    return entries.map((entry) => ({
      ...normalizeDirectoryEntry(entry),
      path: this.toVirtualPath(entry.path),
    }));
  }

  async rename(source: string, destination: string): Promise<void> {
    try {
      await renamePath(this.resolvePath(source), this.resolvePath(destination));
    } catch (error) {
      this.logAndThrow(error, 'rename');
    }
  }
}
