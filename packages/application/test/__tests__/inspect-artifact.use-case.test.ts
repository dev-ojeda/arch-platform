import { describe, expect, it, vi } from 'vitest';

import type {
  ArtifactDistributionPreparedWriter,
  PackedArtifactInspect,
  PackedReader,
} from '@arch-platform/platform-model';

import { InspectArtifactUseCase } from '../../src/use-cases/inspect-artifact/inspect-artifact.use-case.js';

const contractsInspection: PackedArtifactInspect = {
  artifactRegistryStatus: 'registered',
  artifact: 'arch-platform-contracts-0.1.0.tgz',
  file: 'artifacts/arch-platform-contracts-0.1.0.tgz',
  size: 8572,
  package: {
    name: '@arch-platform/contracts',
    version: '0.1.0',
    filesInside: ['package/package.json', 'package/dist/index.js'],
  },
  integrity: {
    calculated: 'sha512-test-contracts',
  },
};

describe('InspectArtifactUseCase', () => {
  it('returns the inspection for the requested artifact', async () => {
    const reader: PackedReader = {
      read: vi.fn().mockResolvedValue([contractsInspection]),
    };

    const writer: ArtifactDistributionPreparedWriter = {
      apply: vi.fn(),
      write: vi.fn().mockResolvedValue(undefined),
      getState: vi.fn(),
    };

    const useCase = new InspectArtifactUseCase(reader, writer, 'artifacts');

    const result = await useCase.execute({
      artifact: '@arch-platform/contracts',
    });

    expect(result).toEqual({
      success: true,
      durationMs: expect.any(Number),
      artifact: '@arch-platform/contracts',
      inspection: contractsInspection,
    });

    expect(reader.read).toHaveBeenCalledWith('artifacts');

    expect(writer.apply).toHaveBeenCalledWith({
      artifactRegistryStatus: 'registered',
      artifact: 'arch-platform-contracts-0.1.0.tgz',
      file: 'artifacts/arch-platform-contracts-0.1.0.tgz',
      packageName: '@arch-platform/contracts',
      version: '0.1.0',
      integrityCalculated: true,
      integrityMatches: undefined,
      integrityResolved: false,
    });

    expect(writer.write).toHaveBeenCalledOnce();
  });

  it('selects the requested package when multiple artifacts are available', async () => {
    const generatorInspection: PackedArtifactInspect = {
      artifactRegistryStatus: 'not-registered',
      artifact: 'arch-platform-generator-mvc-0.1.0.tgz',
      file: 'artifacts/arch-platform-generator-mvc-0.1.0.tgz',
      size: 1000,
      package: {
        name: '@arch-platform/generator-mvc',
        version: '0.1.0',
        filesInside: ['package/package.json'],
      },
      integrity: {
        calculated: 'sha512-test-generator-mvc',
      },
    };

    const reader: PackedReader = {
      read: vi.fn().mockResolvedValue([contractsInspection, generatorInspection]),
    };

    const writer: ArtifactDistributionPreparedWriter = {
      apply: vi.fn(),
      write: vi.fn().mockResolvedValue(undefined),
      getState: vi.fn(),
    };

    const useCase = new InspectArtifactUseCase(reader, writer, 'artifacts');

    const result = await useCase.execute({
      artifact: '@arch-platform/generator-mvc',
    });

    expect(result.inspection).toEqual(generatorInspection);
    expect(result.artifact).toBe('@arch-platform/generator-mvc');

    expect(writer.apply).toHaveBeenCalledWith({
      artifactRegistryStatus: 'not-registered',
      artifact: 'arch-platform-generator-mvc-0.1.0.tgz',
      file: 'artifacts/arch-platform-generator-mvc-0.1.0.tgz',
      packageName: '@arch-platform/generator-mvc',
      version: '0.1.0',
      integrityCalculated: true,
      integrityMatches: undefined,
      integrityResolved: false,
    });

    expect(writer.write).toHaveBeenCalledOnce();
  });

  it('fails when the requested artifact is not packed', async () => {
    const reader: PackedReader = {
      read: vi.fn().mockResolvedValue([contractsInspection]),
    };

    const writer: ArtifactDistributionPreparedWriter = {
      apply: vi.fn(),
      write: vi.fn().mockResolvedValue(undefined),
      getState: vi.fn(),
    };

    const useCase = new InspectArtifactUseCase(reader, writer, 'artifacts');

    await expect(
      useCase.execute({
        artifact: '@arch-platform/code-analysis',
      }),
    ).rejects.toThrow('Packed artifact "@arch-platform/code-analysis" was not found');

    expect(writer.apply).not.toHaveBeenCalled();
    expect(writer.write).not.toHaveBeenCalled();
  });
});
