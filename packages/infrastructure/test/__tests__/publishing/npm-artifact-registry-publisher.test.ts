import { describe, expect, it } from 'vitest';

import { NpmArtifactRegistryPublisher } from '@arch-platform/infrastructure';
import type {
  ArtifactRegistryPublishingReader,
  ExecutionProcess,
} from '@arch-platform/platform-model';

import { joinPath } from '../../../src/filesystem/io/path-utils.js';
import { FIXTURE_PATHS } from '../../fixture/fixture-paths.js';

describe('NpmArtifactRegistryPublisher', { timeout: 50000 }, () => {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  it('publishes the exact registry artifact', async () => {
    const registryReader: ArtifactRegistryPublishingReader = {
      find: async (packageName, version) => ({
        packageName,
        version,
      }),
    };

    const calls: Array<{
      filePath: string;
      args: readonly string[];
    }> = [];

    const process: ExecutionProcess = {
      async execute() {
        throw new Error('execute should not be called');
      },

      async executeInteractive(filePath, args) {
        calls.push({ filePath, args });
      },
    };

    const archContractsArtifact = joinPath(
      FIXTURE_PATHS.archWorkspace,
      'artifacts',
      'arch-platform-contracts-0.1.0.tgz',
    );

    const publisher = new NpmArtifactRegistryPublisher(process, registryReader);

    const result = await publisher.publish(
      archContractsArtifact,
      '@arch-platform/contracts',
      '0.1.0',
    );

    expect(result).toEqual({
      packageName: '@arch-platform/contracts',
      version: '0.1.0',
    });

    expect(calls).toEqual([
      {
        filePath: npmCommand,
        args: [
          'publish',
          archContractsArtifact,
          '--registry',
          'https://registry.npmjs.org',
          '--access',
          'public',
        ],
      },
    ]);
  });

  it('fails when registry publication cannot be verified', async () => {
    const registryReader: ArtifactRegistryPublishingReader = {
      find: async () => undefined,
    };

    const process: ExecutionProcess = {
      async execute() {
        throw new Error('execute should not be called');
      },

      async executeInteractive() {
        // npm publish succeeded
      },
    };

    const publisher = new NpmArtifactRegistryPublisher(
      process,
      registryReader,
      'https://registry.npmjs.org',
      {
        timeoutMs: 0,
        wait: async () => {},
      },
    );

    await expect(
      publisher.publish(
        'artifacts/arch-platform-contracts-0.1.0.tgz',
        '@arch-platform/contracts',
        '0.1.0',
      ),
    ).rejects.toThrow(
      'npm publish succeeded, but registry publication could not be verified for "@arch-platform/contracts@0.1.0"',
    );
  });

  it('does not verify the registry when npm publish fails', async () => {
    let registryLookupCalled = false;

    const registryReader: ArtifactRegistryPublishingReader = {
      find: async () => {
        registryLookupCalled = true;
        return undefined;
      },
    };

    const process: ExecutionProcess = {
      async execute() {
        throw new Error('execute should not be called');
      },

      async executeInteractive() {
        throw new Error('npm publish failed');
      },
    };

    const publisher = new NpmArtifactRegistryPublisher(process, registryReader);

    await expect(
      publisher.publish(
        'artifacts/arch-platform-contracts-0.1.0.tgz',
        '@arch-platform/contracts',
        '0.1.0',
      ),
    ).rejects.toThrow('npm publish failed');

    expect(registryLookupCalled).toBe(false);
  });

  it('retries registry verification until the published version becomes available', async () => {
    let registryLookupCount = 0;
    const waits: number[] = [];

    const registryReader: ArtifactRegistryPublishingReader = {
      find: async (packageName, version) => {
        registryLookupCount += 1;

        if (registryLookupCount < 3) {
          return undefined;
        }

        return {
          packageName,
          version,
          integrity: 'sha512-published-integrity',
        };
      },
    };

    const process: ExecutionProcess = {
      async execute() {
        throw new Error('execute should not be called');
      },

      async executeInteractive() {
        // npm publish succeeded
      },
    };

    const publisher = new NpmArtifactRegistryPublisher(
      process,
      registryReader,
      'https://registry.npmjs.org',
      {
        timeoutMs: 60_000,
        intervalMs: 10_000,
        wait: async (milliseconds) => {
          waits.push(milliseconds);
        },
      },
    );

    const result = await publisher.publish(
      'artifacts/arch-platform-contracts-0.1.0.tgz',
      '@arch-platform/contracts',
      '0.1.0',
    );

    expect(result).toEqual({
      packageName: '@arch-platform/contracts',
      version: '0.1.0',
      integrity: 'sha512-published-integrity',
    });

    expect(registryLookupCount).toBe(3);
    expect(waits).toEqual([10_000, 10_000]);
  });
});
