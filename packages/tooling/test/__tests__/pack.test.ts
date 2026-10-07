import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buildCommand } from '../../src/commands/builder/build.js';
import { runPackCommand } from '../../src/commands/pack/run.js';
import { executeProcess } from '../../src/runtime/process/execute-process.js';
import { createTestFilesystemRoot } from '../fixtures/create-test-filesystem-root.js';

describe('pack', { timeout: 15000 }, () => {
  it('creates a consumable package tarball', async () => {
    const workspaceRoot = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));

    const testRoot = createTestFilesystemRoot('arch-pack');
    const artifactsRoot = join(testRoot, 'artifacts');
    const consumerRoot = join(testRoot, 'consumer');

    await mkdir(artifactsRoot, { recursive: true });

    const fixtureRoot = fileURLToPath(
      new URL('../fixtures/workspace/package-consumer/', import.meta.url),
    );

    await cp(fixtureRoot, consumerRoot, { recursive: true });

    await buildCommand({
      packageName: '@arch-platform/contracts',
    });

    const packResult = await runPackCommand({
      cwd: workspaceRoot,
      packageName: '@arch-platform/contracts',
      outputDirectory: artifactsRoot,
    });

    expect(packResult.execution.exitCode).toBe(0);

    const tarball = join(artifactsRoot, 'arch-platform-contracts-0.1.0.tgz');

    const packageJsonPath = join(consumerRoot, 'package.json');

    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
    };

    packageJson.dependencies = {
      ...packageJson.dependencies,
      '@arch-platform/contracts': `file:${tarball}`,
    };

    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

    const installResult = await executeProcess('pnpm', ['install'], {
      cwd: consumerRoot,
    });
    expect(installResult.exitCode).toBe(0);

    const typecheckResult = await executeProcess('pnpm', ['exec', 'tsc', '--noEmit'], {
      cwd: consumerRoot,
    });
    expect(typecheckResult.exitCode).toBe(0);

    const readJson = await executeProcess('tar', ['-O', '-xf', tarball, 'package/package.json'], {
      cwd: consumerRoot,
      stdout: 'pipe',
    });

    expect(readJson.exitCode).toBe(0);
  });
});
