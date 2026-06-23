// packages\governance\test\__tests__\build-governance-context.test.ts

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildGovernanceContext } from '../../src/context/build-governance-context.js';

describe('buildGovernanceContext (fs integration)', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map((dir) => fs.rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('returns empty context when no packages exist', async () => {
    const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'gov-empty-'));

    tempDirs.push(workspace);

    await fs.mkdir(path.join(workspace, 'packages'));

    const result = await buildGovernanceContext(workspace);

    expect(result.packages).toEqual([]);
  });

  it('builds context from real package folders', async () => {
    const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'gov-context-'));

    tempDirs.push(workspace);

    const pkgA = path.join(workspace, 'packages/pkg-a');
    const pkgB = path.join(workspace, 'packages/pkg-b');

    await fs.mkdir(pkgA, { recursive: true });
    await fs.mkdir(pkgB, { recursive: true });

    await fs.writeFile(path.join(pkgA, 'package.json'), JSON.stringify({ name: 'pkg-a' }));

    await fs.writeFile(path.join(pkgB, 'package.json'), JSON.stringify({ name: 'pkg-b' }));

    const result = await buildGovernanceContext(workspace);

    expect(result.packages.length).toBe(2);
    expect(result.packages.map((p) => p.name)).toEqual(expect.arrayContaining(['pkg-a', 'pkg-b']));
  });

  it('handles missing packages directory gracefully', async () => {
    const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'gov-missing-'));

    tempDirs.push(workspace);

    const result = await buildGovernanceContext(workspace);

    expect(result.packages).toEqual([]);
  });
});
