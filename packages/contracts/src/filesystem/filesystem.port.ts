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
  read(strPath: string): Promise<string>;

  write(
    strPath: string,

    content: string,

    options?: WriteFileOptions,
  ): Promise<void>;

  copy(
    source: string,

    destination: string,
  ): Promise<void>;

  createDirectory(strPath: string): Promise<void>;

  exists(strPath: string): Promise<boolean>;

  remove(strPath: string): Promise<void>;

  readDirectory(strPath: string): Promise<DirectoryEntry[]>;
}
