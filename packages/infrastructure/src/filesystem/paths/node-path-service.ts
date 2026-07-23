// packages/infrastructure/src/filesystem/paths/node-path-service.ts

import type { PathService } from '@arch/contracts';

import {
  baseName,
  dirName,
  isAbsolutePath,
  joinPath,
  normalizePath,
  relativePath,
  resolvePath,
} from '../io/path-utils.js';

export class NodePathService implements PathService {
  join(...segments: string[]): string {
    return joinPath(...segments);
  }

  normalize(targetPath: string): string {
    return normalizePath(targetPath); // node:path.normalize
  }
  relative(from: string, to: string): string {
    return relativePath(from, to);
  }

  isAbsolute(targetPath: string): boolean {
    return isAbsolutePath(targetPath);
  }

  resolve(...segments: string[]): string {
    return resolvePath(...segments);
  }

  dirname(targetPath: string): string {
    return dirName(targetPath);
  }

  basename(targetPath: string): string {
    return baseName(targetPath);
  }
}
