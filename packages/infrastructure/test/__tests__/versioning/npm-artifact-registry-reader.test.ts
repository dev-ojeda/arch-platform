import { describe, expect, it } from 'vitest';

import { NpmArtifactRegistryReader } from '../../../src/versioning/npm-artifact-registry-reader.js';

describe('NpmArtifactRegistryReader', () => {
  const reader = new NpmArtifactRegistryReader();
  it('exist package and version in artifact in registry', async () => {
    expect(await reader.find('@arch-platform/contracts', '0.2.0')).toEqual({
      packageName: '@arch-platform/contracts',
      version: '0.2.0',
      integrity:
        'sha512-ll6RTIDmQxgJeMyZPc2yLU4f1kh4mktyzdD7O6K9hvozUx+CF0pCS/TL6jbu1YPmJwWQ11qQnv8SiZ6NuRmKsg==',
      tarball: 'https://registry.npmjs.org/@arch-platform/contracts/-/contracts-0.2.0.tgz',
      tag: undefined,
    });
  });

  it('not exist version artifact in registry', async () => {
    expect(await reader.find('@arch-platform/contracts', '')).toEqual({
      integrity: undefined,
      packageName: '@arch-platform/contracts',
      version: undefined,
    });
  });

  it('get all versions artifacts in registry', async () => {
    const readers = await reader.findAll('@arch-platform/contracts');

    expect(readers).toEqual([
      {
        integrity:
          'sha512-61FXwdSykq2BnI0xXEP6JR0LjocZtv13AUa+3rUm6tpL3umo5CsWo8ARIbw/wt8HkRK6CjqCumlStFo+HX+InQ==',
        packageName: '@arch-platform/contracts',
        tag: undefined,
        tarball: 'https://registry.npmjs.org/@arch-platform/contracts/-/contracts-0.3.0-0.tgz',
        version: '0.3.0-0',
      },
      {
        integrity:
          'sha512-88rqE//r5zgFJ7tubLaDvZ7vUxbAxMHpi9ae6RJzOT+fz8ytLZ23FQX0z9wzdpg5MLAr9T+IWwCKQQ2QPBvlKQ==',
        packageName: '@arch-platform/contracts',
        tag: undefined,
        tarball: 'https://registry.npmjs.org/@arch-platform/contracts/-/contracts-0.2.2.tgz',
        version: '0.2.2',
      },
      {
        integrity:
          'sha512-mTYLuCvZrfZKZoe0MLULo+2elOFjgwtVK6CLvu1QManOXscevYjoh8N6VLqPaw/fXnLbxeP81c9B5rd2OXXyUA==',
        packageName: '@arch-platform/contracts',
        tag: undefined,
        tarball: 'https://registry.npmjs.org/@arch-platform/contracts/-/contracts-0.2.1.tgz',
        version: '0.2.1',
      },
      {
        integrity:
          'sha512-ll6RTIDmQxgJeMyZPc2yLU4f1kh4mktyzdD7O6K9hvozUx+CF0pCS/TL6jbu1YPmJwWQ11qQnv8SiZ6NuRmKsg==',
        packageName: '@arch-platform/contracts',
        tag: undefined,
        tarball: 'https://registry.npmjs.org/@arch-platform/contracts/-/contracts-0.2.0.tgz',
        version: '0.2.0',
      },
      {
        integrity:
          'sha512-Zdfy24smncfimMk/8bWe3FKgXsnnhfvLmh/coqCFl7zEA+wcVEclDkjfpXTLVXwpm/X4boB8Ad+Im6R3NwHpnQ==',
        packageName: '@arch-platform/contracts',
        tag: undefined,
        tarball: 'https://registry.npmjs.org/@arch-platform/contracts/-/contracts-0.1.0.tgz',
        version: '0.1.0',
      },
    ]);
  });
});
