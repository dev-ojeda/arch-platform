import { describe, expect, it, vi } from 'vitest';

import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsAdapterPort,
  RegistryPublishedVersionsReader,
  RegistryPublishedVersionsWriter,
} from '@arch-platform/platform-model';

import { SyncRegistryUseCase } from '../../../src/use-cases/registry/sync-registry.use-case.js';

const contractsPublished: RegistryPublishedVersions = {
  schemaVersion: 1,
  registry: 'https://registry.npmjs.org',
  synchronizedAt: '2026-10-13T12:00:00.000Z',
  packages: [
    {
      packageName: '@arch-platform/contracts',
      'dist-tags': {
        latest: '0.2.1',
      },
      versions: {
        '0.2.0': {
          name: '@arch-platform/contracts',
          version: '0.2.0',
          dist: {
            integrity: 'sha512-contracts-020',
            tarball: 'https://registry.npmjs.org/@arch-platform/contracts/-/contracts-0.2.0.tgz',
          },
        },
        '0.2.1': {
          name: '@arch-platform/contracts',
          version: '0.2.1',
          dist: {
            integrity: 'sha512-contracts-021',
            tarball: 'https://registry.npmjs.org/@arch-platform/contracts/-/contracts-0.2.1.tgz',
          },
        },
      },
    },
  ],
};

const generatorPublished: RegistryPublishedVersions = {
  schemaVersion: 1,
  registry: 'https://registry.npmjs.org',
  synchronizedAt: '2026-10-13T12:00:00.000Z',
  packages: [
    {
      packageName: '@arch-platform/generator-mvc',
      'dist-tags': {
        latest: '0.1.0',
      },
      versions: {
        '0.1.0': {
          name: '@arch-platform/generator-mvc',
          version: '0.1.0',
          dist: {
            integrity: 'sha512-generator-mvc-010',
            tarball:
              'https://registry.npmjs.org/@arch-platform/generator-mvc/-/generator-mvc-0.1.0.tgz',
          },
        },
      },
    },
  ],
};

function createAdapter(): RegistryPublishedVersionsAdapterPort {
  return {
    fetchPublishedVersions: vi.fn(),
    fetchPublishedVersionsByScope: vi.fn(),
  };
}

function createReader(): RegistryPublishedVersionsReader {
  return {
    read: vi.fn(),
  };
}

function createWriter(): RegistryPublishedVersionsWriter {
  return {
    apply: vi.fn(),
    write: vi.fn().mockResolvedValue(undefined),
    getState: vi.fn(),
  };
}

describe('SyncRegistryUseCase', () => {
  it('synchronizes the requested package and persists its published versions', async () => {
    const adapter = createAdapter();
    vi.mocked(adapter.fetchPublishedVersions).mockResolvedValue(contractsPublished);

    const reader = createReader();
    const writer = createWriter();

    const useCase = new SyncRegistryUseCase(adapter, reader, writer);

    const result = await useCase.execute({
      artifact: '@arch-platform/contracts',
      scope: '@arch-platform',
    });

    expect(result).toEqual({
      success: true,
      durationMs: expect.any(Number),
      scope: '@arch-platform',
      packagesSynchronized: 1,
      versionsSynchronized: 2,
    });

    expect(adapter.fetchPublishedVersions).toHaveBeenCalledOnce();
    expect(adapter.fetchPublishedVersions).toHaveBeenCalledWith('@arch-platform/contracts');
    expect(adapter.fetchPublishedVersionsByScope).not.toHaveBeenCalled();

    expect(writer.apply).toHaveBeenCalledOnce();
    expect(writer.apply).toHaveBeenCalledWith('@arch-platform/contracts', contractsPublished);
    expect(writer.write).toHaveBeenCalledOnce();
  });

  it('synchronizes all packages returned for the requested scope', async () => {
    const adapter = createAdapter();

    vi.mocked(adapter.fetchPublishedVersionsByScope).mockResolvedValue([
      contractsPublished,
      generatorPublished,
    ]);

    const reader = createReader();
    const writer = createWriter();

    const useCase = new SyncRegistryUseCase(adapter, reader, writer);

    const result = await useCase.execute({
      scope: '@arch-platform',
    });

    expect(result).toEqual({
      success: true,
      durationMs: expect.any(Number),
      scope: '@arch-platform',
      packagesSynchronized: 2,
      versionsSynchronized: 3,
    });

    expect(adapter.fetchPublishedVersionsByScope).toHaveBeenCalledOnce();
    expect(adapter.fetchPublishedVersionsByScope).toHaveBeenCalledWith('@arch-platform');
    expect(adapter.fetchPublishedVersions).not.toHaveBeenCalled();

    expect(writer.apply).toHaveBeenNthCalledWith(1, '@arch-platform/contracts', contractsPublished);
    expect(writer.apply).toHaveBeenNthCalledWith(
      2,
      '@arch-platform/generator-mvc',
      generatorPublished,
    );
    expect(writer.apply).toHaveBeenCalledTimes(2);
    expect(writer.write).toHaveBeenCalledOnce();
  });

  it('persists the state once when the scope contains no published packages', async () => {
    const adapter = createAdapter();
    vi.mocked(adapter.fetchPublishedVersionsByScope).mockResolvedValue([]);

    const reader = createReader();
    const writer = createWriter();

    const useCase = new SyncRegistryUseCase(adapter, reader, writer);

    const result = await useCase.execute({
      scope: '@arch-platform',
    });

    expect(result).toEqual({
      success: true,
      durationMs: expect.any(Number),
      scope: '@arch-platform',
      packagesSynchronized: 0,
      versionsSynchronized: 0,
    });

    expect(writer.apply).not.toHaveBeenCalled();
    expect(writer.write).toHaveBeenCalledOnce();
  });

  it('fails when the requested package is not found in the registry', async () => {
    const adapter = createAdapter();
    vi.mocked(adapter.fetchPublishedVersions).mockResolvedValue(undefined);

    const reader = createReader();
    const writer = createWriter();

    const useCase = new SyncRegistryUseCase(adapter, reader, writer);

    await expect(
      useCase.execute({
        artifact: '@arch-platform/unknown',
        scope: '@arch-platform',
      }),
    ).rejects.toThrow(
      'Published versions for "@arch-platform/unknown" were not found in the registry.',
    );

    expect(adapter.fetchPublishedVersions).toHaveBeenCalledWith('@arch-platform/unknown');
    expect(writer.apply).not.toHaveBeenCalled();
    expect(writer.write).not.toHaveBeenCalled();
  });

  it('does not persist changes when fetching the scope fails', async () => {
    const adapter = createAdapter();

    vi.mocked(adapter.fetchPublishedVersionsByScope).mockRejectedValue(
      new Error('Registry unavailable'),
    );

    const reader = createReader();
    const writer = createWriter();

    const useCase = new SyncRegistryUseCase(adapter, reader, writer);

    await expect(
      useCase.execute({
        scope: '@arch-platform',
      }),
    ).rejects.toThrow('Registry unavailable');

    expect(writer.apply).not.toHaveBeenCalled();
    expect(writer.write).not.toHaveBeenCalled();
  });
});
