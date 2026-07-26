// packages/infrastructure/src/filesystem/adapters/node-sync-filesystem-adapter.ts

import type { DirectoryEntry, FileSystemSyncPort, WriteFileOptions } from '@arch/contracts';

import { safeStringify } from '../../serialization/safe-stringify.js';
import {
  copyPathSync,
  ensureDirSync,
  pathExistsSync,
  readBufferSync,
  readDirectoryEntriesSync,
  readJsonFileSync,
  readTextFileSync,
  removePathSync,
  renamePathSync,
  writeTextFileSync,
} from '../io/fs-sync.js';
import { DEFAULT_FILE_SYSTEM_OPTIONS } from '../options/default-filesystem-option.js';
import { normalizeDirectoryEntry } from '../paths/canonicalize-directory-entry.js';
import { NodePathService } from '../paths/node-path-service.js';
import { shouldWriteFile } from '../policies/resolve-write-policy.js';

import { BaseFileSystemAdapter } from './base-filesystem-adapter.js';

import type { FileSystemAdapterOptions } from '../options/filesystem-options.js';

export class NodeSyncFileSystemAdapter extends BaseFileSystemAdapter implements FileSystemSyncPort {
  constructor(options: FileSystemAdapterOptions = DEFAULT_FILE_SYSTEM_OPTIONS) {
    super(
      'NodeSyncFileSystemAdapter',
      options.root ?? DEFAULT_FILE_SYSTEM_OPTIONS.root,
      new NodePathService(),
    );
  }

  exists(targetPath: string): boolean {
    return pathExistsSync(this.resolvePath(targetPath));
  }

  createDirectory(directoryPath: string): void {
    try {
      ensureDirSync(this.resolvePath(directoryPath));
    } catch (error) {
      this.logAndThrow(error, 'createDirectory');
    }
  }
  remove(targetPath: string): void {
    try {
      removePathSync(this.resolvePath(targetPath));
    } catch (error) {
      this.logAndThrow(error, 'remove');
    }
  }
  copy(sourcePath: string, destinationPath: string): void {
    try {
      const source = this.resolvePath(sourcePath);
      const destination = this.resolvePath(destinationPath);
      const parent = this.pathService.dirname(destinationPath);
      this.createDirectory(this.pathService.dirname(parent));
      copyPathSync(source, destination);
    } catch (error) {
      this.logAndThrow(error, 'copy');
    }
  }

  read(filePath: string): string {
    try {
      return readTextFileSync(this.resolvePath(filePath));
    } catch (error) {
      this.logAndThrow(error, 'read');
    }
  }

  readBuffer(filePath: string): Uint8Array {
    return readBufferSync(this.resolvePath(filePath));
  }

  readJson<T>(filePath: string): T {
    return readJsonFileSync<T>(this.resolvePath(filePath));
  }

  readDirectory(directoryPath: string): DirectoryEntry[] {
    const entries = readDirectoryEntriesSync(this.resolvePath(directoryPath));

    return entries.map((entry) => ({
      ...normalizeDirectoryEntry(entry),
      path: this.toVirtualPath(entry.path),
    }));
  }
  rename(source: string, destination: string): void {
    try {
      renamePathSync(this.resolvePath(source), this.resolvePath(destination));
    } catch (error) {
      this.logAndThrow(error, 'rename');
    }
  }
  write(filePath: string, content: string, options?: WriteFileOptions): void {
    const exists = this.exists(filePath);
    if (!shouldWriteFile(exists, options)) {
      return;
    }
    try {
      this.createDirectory(this.resolveParentDirectory(filePath));

      writeTextFileSync(this.resolvePath(filePath), content);
    } catch (error) {
      this.logAndThrow(error, 'write');
    }
  }
  writeJson<T>(filePath: string, value: T, options?: WriteFileOptions): void {
    this.write(this.resolvePath(filePath), safeStringify(value, 2), options);
  }
}
