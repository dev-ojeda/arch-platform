// packages/core/src/generation/__tests__/output-path.test.ts

import type { PathService } from '@arch/contracts';
import { describe, expect, it } from 'vitest';

import { resolveOutputPath } from '../../src/generation/output/output-path.js';

const pathService: PathService = {
  join: (...segments) => segments.join('/'),

  normalize: (targetPath) => targetPath.replace(/\\/g, '/'),

  relative: (from, to) => {
    if (!to.startsWith(from)) {
      return '../outside';
    }

    return to.replace(`${from}/`, '').replace(from, '');
  },

  isAbsolute: (targetPath) => targetPath.startsWith('/'),

  resolve: (...segments) => segments.join('/'),

  dirname: (targetPath) => targetPath.split('/').slice(0, -1).join('/'),

  basename: (targetPath) => targetPath.split('/').pop() ?? '',
};

describe('resolveOutputPath', () => {
  it('should resolve safe paths', () => {
    const outputPath = resolveOutputPath(pathService, '/project', 'src/users.ts');

    expect(outputPath).toContain('src');
  });

  it('should prevent path traversal', () => {
    expect(() => resolveOutputPath(pathService, '/project', '../../evil.txt')).toThrowError();
  });
});
