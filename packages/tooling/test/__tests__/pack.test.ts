import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { runPackCommand } from '../../src/commands/pack/run.js';
import { executeProcess } from '../../src/runtime/process/execute-process.js';
import { createTestFilesystemRoot } from '../fixtures/create-test-filesystem-root.js';

describe('pack', { timeout: 15000 }, () => {
  it('creates a consumable package tarball', async () => {
    const testRoot = createTestFilesystemRoot('arch-pack');

    try {
      const artifactsRoot = join(testRoot, 'artifacts');
      const consumerRoot = join(testRoot, 'consumer');

      const workspaceRoot = fileURLToPath(
        new URL('../fixtures/workspace/packages', import.meta.url),
      );

      const packageRoot = join(workspaceRoot, 'package-to-pack');
      const packageJsonPath = join(packageRoot, 'package.json');

      await mkdir(artifactsRoot, { recursive: true });

      const fixtureRoot = fileURLToPath(
        new URL('../fixtures/workspace/packages/package-consumer/', import.meta.url),
      );

      await cp(fixtureRoot, consumerRoot, { recursive: true });

      const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
        name: string;
        version: string;
      };

      const packResult = await runPackCommand({
        cwd: workspaceRoot,
        packageName: packageJson.name,
        outputDirectory: artifactsRoot,
      });
      expect(packResult.execution.exitCode).toBe(0);

      const tarballName = `${packageJson.name
        .replace(/^@/, '')
        .replace('/', '-')}-${packageJson.version}.tgz`;
      const tarball = join(artifactsRoot, packageJson.name, packageJson.version, tarballName);

      const packageJsonConsumerPath = join(consumerRoot, 'package.json');
      const consumerPackageJson = JSON.parse(await readFile(packageJsonConsumerPath, 'utf8')) as {
        dependencies?: Record<string, string>;
      };

      consumerPackageJson.dependencies = {
        ...consumerPackageJson.dependencies,
        [packageJson.name]: `file:${tarball}`,
      };

      await writeFile(packageJsonConsumerPath, `${JSON.stringify(consumerPackageJson, null, 2)}\n`);

      const installResult = await executeProcess('pnpm', ['install'], {
        cwd: consumerRoot,
      });
      expect(installResult.exitCode).toBe(0);

      const typecheckResult = await executeProcess('pnpm', ['exec', 'tsc', '--noEmit'], {
        cwd: consumerRoot,
      });

      expect(typecheckResult.exitCode).toBe(0);
    } finally {
      await rm(testRoot, {
        recursive: true,
        force: true,
      });
    }
  });
});
