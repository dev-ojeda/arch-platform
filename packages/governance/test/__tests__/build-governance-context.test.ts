// packages\governance\test\__tests__\build-governance-context.test.ts

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildGovernanceContext } from '../../src/context/build-governance-context.js';

describe('buildGovernanceContext (fs integration)', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('returns empty context when no packages exist', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'gov-empty-'));

    tempDirs.push(workspace);

    await mkdir(join(workspace, 'packages'));

    const result = await buildGovernanceContext(workspace);

    expect(result.packages).toEqual([]);
  });

  it('builds context from real package folders', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'gov-context-'));

    tempDirs.push(workspace);

    const pkgA = join(workspace, 'packages/pkg-a');
    const pkgB = join(workspace, 'packages/pkg-b');

    await mkdir(pkgA, { recursive: true });
    await mkdir(pkgB, { recursive: true });

    await writeFile(join(pkgA, 'package.json'), JSON.stringify({ name: 'pkg-a' }));

    await writeFile(join(pkgB, 'package.json'), JSON.stringify({ name: 'pkg-b' }));

    const result = await buildGovernanceContext(workspace);

    expect(result.packages.length).toBe(2);
    expect(result.packages.map((p) => p.name)).toEqual(expect.arrayContaining(['pkg-a', 'pkg-b']));
  });

  it('handles missing packages directory gracefully', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'gov-missing-'));

    tempDirs.push(workspace);

    const result = await buildGovernanceContext(workspace);

    expect(result.packages).toEqual([]);
  });
});
