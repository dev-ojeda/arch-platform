// packages/build-core/src/fs/index.ts
export {
  copyPath,
  ensureDir,
  pathExists,
  readBuffer,
  readDirectoryEntries,
  readTextFile,
  removePath,
  renamePath,
  writeTextFile,
} from './fs-async.js';
export type { CopyPathOptions } from './fs-async.js';
export {
  ensureDirSync,
  fileSizeSync,
  getPathStatSync,
  isDirectory,
  isFile,
  pathExistsSync,
  readBufferSync,
  readDirectoryEntriesSync,
  readJsonFileSync,
  readNormalizedTextFileSync,
  readTextFileSync,
  removePathSync,
  tryFileSize,
  writeJsonFileSync,
  writeTextFileSync,
} from './fs-sync.js';
export {
  distPath,
  joinPath,
  packagePath,
  relativePath,
  resolvePath,
  srcPath,
  statePath,
} from './path-utils.js';
