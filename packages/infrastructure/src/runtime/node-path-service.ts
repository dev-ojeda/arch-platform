// packages/infrastructure/src/runtime/node-path-service.ts

import path from 'node:path';

import type { PathService } from '@arch/contracts/runtime';

export class NodePathService implements PathService {
  join(...segments: string[]): string {
    return path.join(...segments);
  }

  normalize(targetPath: string): string {
    return path.normalize(targetPath);
  }

  relative(from: string, to: string): string {
    return path.relative(from, to);
  }

  isAbsolute(targetPath: string): boolean {
    return path.isAbsolute(targetPath);
  }

  resolve(...segments: string[]): string {
    return path.resolve(...segments);
  }

  dirname(targetPath: string): string {
    return path.dirname(targetPath);
  }

  basename(targetPath: string): string {
    return path.basename(targetPath);
  }
}
