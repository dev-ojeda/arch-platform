// packages/contracts/src/filesystem/filesystem-async-port.ts

import type { DirectoryEntry } from './directory-entry.js';
import type { WriteFileOptions } from './write-file-options.js';

export interface FileSystemAsyncPort {
  copy(sourcePath: string, destinationPath: string): Promise<void>;

  createDirectory(directoryPath: string): Promise<void>;

  exists(targetPath: string): Promise<boolean>;

  read(filePath: string): Promise<string>;

  readJson<T>(filePath: string): Promise<T>;

  readBuffer(filePath: string): Promise<Uint8Array>;

  remove(targetPath: string): Promise<void>;

  readDirectory(directoryPath: string): Promise<DirectoryEntry[]>;

  rename(source: string, destination: string): Promise<void>;

  write(filePath: string, content: string, options?: WriteFileOptions): Promise<void>;

  writeJson<T>(filePath: string, value: T, options?: WriteFileOptions): Promise<void>;
}
