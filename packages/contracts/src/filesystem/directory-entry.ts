// packages/contracts/src/filesystem/directory-entry.ts

export interface DirectoryEntry {
  path: string;
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymbolicLink: boolean;
}
