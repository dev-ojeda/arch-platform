// packages/infrastructure/test/__tests__/filesystem/base-filesystem-adapter-paths.test.ts

import posixPath from 'node:path/posix';
import win32Path from 'node:path/win32';

import { describe, expect, it } from 'vitest';

import type { PathService } from '@arch-platform/contracts';

import { BaseFileSystemAdapter } from '../../../src/filesystem/adapters/base-filesystem-adapter.js';

// Implementación de PathService respaldada por win32 o posix
function createPlatformPathService(impl: typeof posixPath | typeof win32Path): PathService {
  return {
    join: (...segments) => impl.join(...segments),
    normalize: (targetPath) => impl.normalize(targetPath),
    relative: (from, to) => impl.relative(from, to),
    isAbsolute: (targetPath) => impl.isAbsolute(targetPath),
    resolve: (...segments) => impl.resolve(...segments),
    dirname: (targetPath) => impl.dirname(targetPath),
    basename: (targetPath) => impl.basename(targetPath),
  };
}

// Subclase concreta para exponer los métodos protegidos en los tests
class TestFileSystemAdapter extends BaseFileSystemAdapter {
  constructor(root: string, pathService: PathService) {
    super('TestFileSystemAdapter', root, pathService);
  }

  public exposeResolvePath(targetPath: string): string {
    return this.resolvePath(targetPath);
  }

  public exposeToVirtualPath(targetPath: string): string {
    return this.toVirtualPath(targetPath);
  }

  public exposeResolveTempPrefix(prefix?: string): {
    resolvedPrefix: string;
    parentDirectory: string;
  } {
    return this.resolveTempPrefix(prefix);
  }
}

describe.each([
  {
    os: 'Ubuntu (POSIX)',
    pathImpl: posixPath,
    root: '/var/workspace/project',
    sep: '/',
    outsidePhysical: '/var/workspace/project/../../etc/passwd',
  },
  {
    os: 'Windows (Win32)',
    pathImpl: win32Path,
    root: 'C:\\workspace\\project',
    sep: '\\',
    outsidePhysical: 'D:\\other\\file.txt',
  },
])('BaseFileSystemAdapter path resolution on $os', ({ pathImpl, root, sep, outsidePhysical }) => {
  const pathService = createPlatformPathService(pathImpl);
  const adapter = new TestFileSystemAdapter(root, pathService);

  describe('resolvePath (Virtual/Relative -> Physical)', () => {
    it('resolves virtual root "/" to physical root', () => {
      expect(adapter.exposeResolvePath('/')).toBe(root);
    });

    it('resolves virtual paths with leading slash to physical paths', () => {
      const expected = `${root}${sep}src${sep}domain${sep}user.ts`;
      expect(adapter.exposeResolvePath('/src/domain/user.ts')).toBe(expected);
    });

    it('resolves relative paths without leading slash', () => {
      const expected = `${root}${sep}src${sep}index.ts`;
      expect(adapter.exposeResolvePath('src/index.ts')).toBe(expected);
    });

    it('normalizes mixed forward and backward slashes', () => {
      const expected = `${root}${sep}src${sep}utils${sep}helper.ts`;
      expect(adapter.exposeResolvePath('\\src\\utils/helper.ts')).toBe(expected);
    });

    it('accepts a physical path that is already inside root', () => {
      const physicalInside = `${root}${sep}config${sep}app.json`;
      expect(adapter.exposeResolvePath(physicalInside)).toBe(physicalInside);
    });

    it('allows files or folders starting with ".." inside root (e.g. "..config")', () => {
      const expected = `${root}${sep}..config${sep}settings.json`;
      expect(adapter.exposeResolvePath('/..config/settings.json')).toBe(expected);
    });

    it('throws on path traversal attempts escaping root', () => {
      expect(() => adapter.exposeResolvePath('/../../outside.txt')).toThrow(
        /Path outside filesystem root/,
      );
      expect(() => adapter.exposeResolvePath('..\\..\\outside.txt')).toThrow(
        /Path outside filesystem root/,
      );
    });

    it('throws when given a physical path outside root', () => {
      expect(() => adapter.exposeResolvePath(outsidePhysical)).toThrow(
        /Path outside filesystem root/,
      );
    });
    it('treats leading-slash paths outside root prefix as safe virtual paths', () => {
      const expected = `${root}${sep}etc${sep}config.json`;
      expect(adapter.exposeResolvePath('/etc/config.json')).toBe(expected);
    });
  });

  describe('toVirtualPath (Physical -> Virtual)', () => {
    it('converts physical root to "/"', () => {
      expect(adapter.exposeToVirtualPath(root)).toBe('/');
    });

    it('converts physical nested paths to POSIX virtual paths', () => {
      const physical = `${root}${sep}src${sep}modules${sep}auth.ts`;
      expect(adapter.exposeToVirtualPath(physical)).toBe('/src/modules/auth.ts');
    });

    it('throws when converting a physical path outside root', () => {
      expect(() => adapter.exposeToVirtualPath(outsidePhysical)).toThrow(
        /Path outside filesystem root/,
      );
    });
  });

  describe('resolveTempPrefix (Temp directory prefix resolution)', () => {
    it('uses default "tmp-" prefix in root when no prefix is provided', () => {
      const result = adapter.exposeResolveTempPrefix();

      expect(result).toEqual({
        resolvedPrefix: `${root}${sep}tmp-`,
        parentDirectory: root,
      });
    });

    it('appends "tmp-" when prefix is empty or virtual root "/"', () => {
      expect(adapter.exposeResolveTempPrefix('')).toEqual({
        resolvedPrefix: `${root}${sep}tmp-`,
        parentDirectory: root,
      });

      expect(adapter.exposeResolveTempPrefix('/')).toEqual({
        resolvedPrefix: `${root}${sep}tmp-`,
        parentDirectory: root,
      });
    });

    it('appends "tmp-" when prefix ends with a forward or backward slash', () => {
      const expectedParent = `${root}${sep}builds`;
      const expectedPrefix = `${expectedParent}${sep}tmp-`;

      expect(adapter.exposeResolveTempPrefix('builds/')).toEqual({
        resolvedPrefix: expectedPrefix,
        parentDirectory: expectedParent,
      });

      expect(adapter.exposeResolveTempPrefix('builds\\')).toEqual({
        resolvedPrefix: expectedPrefix,
        parentDirectory: expectedParent,
      });
    });

    it('preserves custom prefix name inside nested directories', () => {
      const expectedParent = `${root}${sep}builds${sep}sessions`;
      const expectedPrefix = `${expectedParent}${sep}worker-`;

      expect(adapter.exposeResolveTempPrefix('/builds/sessions/worker-')).toEqual({
        resolvedPrefix: expectedPrefix,
        parentDirectory: expectedParent,
      });
    });

    it('throws when temp prefix attempts path traversal outside root', () => {
      expect(() => adapter.exposeResolveTempPrefix('../outside-')).toThrow(
        /Path outside filesystem root/,
      );
      expect(() => adapter.exposeResolveTempPrefix('..\\..\\outside\\')).toThrow(
        /Path outside filesystem root/,
      );
    });
  });
});
