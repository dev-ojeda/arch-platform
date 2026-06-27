// packages/infrastructure/src/runtime/node-path-service.ts

import { basename, dirname, isAbsolute, join, normalize, relative, resolve } from 'node:path';

import type { PathService } from '@arch/contracts';

export class NodePathService implements PathService {
  join(...segments: string[]): string {
    return join(...segments);
  }

  normalize(targetPath: string): string {
    return normalize(targetPath);
  }

  relative(from: string, to: string): string {
    return relative(from, to);
  }

  isAbsolute(targetPath: string): boolean {
    return isAbsolute(targetPath);
  }

  resolve(...segments: string[]): string {
    return resolve(...segments);
  }

  dirname(targetPath: string): string {
    return dirname(targetPath);
  }

  basename(targetPath: string): string {
    return basename(targetPath);
  }
}
