// packages\contracts\src\filesystem\filesystem.port.ts

import type { OverwritePolicy } from './overwrite-policy.js';

export interface WriteFileOptions {
  overwrite?: OverwritePolicy;
}

export interface DirectoryEntry {
  name: string;

  path: string;

  isDirectory: boolean;
}

export interface FileSystemPort {
  read(filePath: string): Promise<string>;

  write(filePath: string, content: string, options?: WriteFileOptions): Promise<void>;

  copy(sourcePath: string, destinationPath: string): Promise<void>;

  createDirectory(directoryPath: string): Promise<void>;

  exists(targetPath: string): Promise<boolean>;

  remove(targetPath: string): Promise<void>;

  readDirectory(directoryPath: string): Promise<DirectoryEntry[]>;
}
