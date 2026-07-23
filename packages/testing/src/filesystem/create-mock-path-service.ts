// packages/testing/src/filesystem/create-test-path-service.ts

import { posix } from 'node:path';

import type { PathService } from '@arch/contracts';

export function createTestPathService(): PathService {
  return {
    join(...segments: string[]): string {
      return posix.join(...segments);
    },

    normalize(targetPath: string): string {
      return posix.normalize(targetPath);
    },

    relative(from: string, to: string): string {
      return posix.relative(from, to);
    },

    isAbsolute(targetPath: string): boolean {
      return posix.isAbsolute(targetPath);
    },

    resolve(...segments: string[]): string {
      return posix.resolve(...segments);
    },

    dirname(targetPath: string): string {
      return posix.dirname(targetPath);
    },

    basename(targetPath: string): string {
      return posix.basename(targetPath);
    },
  };
}
