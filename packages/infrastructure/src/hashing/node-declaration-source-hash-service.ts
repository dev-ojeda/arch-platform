// 📦 Paquetes Core (Packages)/infrastructure/src/hashing/node-declaration-source-hash-service.ts

import type { HashService, SourceHashService } from '@arch-platform/contracts';

import {
  isDirectory,
  readDirectoryEntriesSync,
  readNormalizedTextFileSync,
} from '../filesystem/io/fs-sync.js';
import { joinPath, packagePath, relativePath, resolvePath } from '../filesystem/io/path-utils.js';

import { normalizeTypeScriptComments } from './normalize-typescript-comments.js';

const IGNORED_DIRS = new Set(['node_modules', 'dist', '.turbo', '.git']);
const IGNORED_FILES = new Set(['tsconfig.tsbuildinfo']);

const TYPESCRIPT_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts']);

export class NodeSourceHashService implements SourceHashService {
  constructor(private readonly hashService: HashService) {}

  hashSource(path: string): string {
    const root = resolvePath(packagePath(path, 'src'));
    const files: string[] = [];

    this.walk(root, files);

    const hashInput = files
      .sort()
      .map((file) => {
        const source = readNormalizedTextFileSync(file);
        const content = this.isTypeScriptFile(file) ? normalizeTypeScriptComments(source) : source;

        return `${relativePath(root, file)}\0${content}\0`;
      })
      .join('');

    return this.hashService.hash(hashInput);
  }

  private walk(directory: string, files: string[]): void {
    const entries = readDirectoryEntriesSync(directory);
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name) || IGNORED_FILES.has(entry.name)) {
        continue;
      }

      const fullPath = joinPath(directory, entry.name);

      if (isDirectory(fullPath)) {
        this.walk(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }
  }

  private isTypeScriptFile(path: string): boolean {
    const filename = path.replaceAll('\\', '/');
    const extension = filename.slice(filename.lastIndexOf('.')).toLowerCase();

    return TYPESCRIPT_EXTENSIONS.has(extension);
  }
}
