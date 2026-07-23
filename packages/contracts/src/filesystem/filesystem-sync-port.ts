// packages/contracts/src/filesystem/filesystem-sync-port.ts

import type { DirectoryEntry } from './directory-entry.js';
import type { WriteFileOptions } from './write-file-options.js';

export interface FileSystemSyncPort {
  copy(sourcePath: string, destinationPath: string): void;

  createDirectory(directoryPath: string): void;

  exists(targetPath: string): boolean;

  remove(targetPath: string): void;

  read(filePath: string): string;

  readBuffer(filePath: string): Uint8Array;

  readJson<T>(filePath: string): T;

  readDirectory(directoryPath: string): DirectoryEntry[];

  rename(source: string, destination: string): void;

  write(filePath: string, content: string, options?: WriteFileOptions): void;

  writeJson<T>(filePath: string, value: T, options?: WriteFileOptions): void;
}
