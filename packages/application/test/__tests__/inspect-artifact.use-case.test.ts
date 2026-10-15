import { describe, expect, it, vi } from 'vitest';

import type { PathService } from '@arch-platform/contracts';
import type {
  ArtifactDistributionPreparedWriter,
  PackageDescriptor,
  PackedArtifactInspect,
  PackedReader,
} from '@arch-platform/platform-model';

import { InspectArtifactUseCase } from '../../src/use-cases/inspect-artifact/inspect-artifact.use-case.js';

const contractsInspection: PackedArtifactInspect = {
  artifactRegistryStatus: 'registered',
  artifact: 'arch-platform-contracts-0.2.1.tgz',
  file: 'artifacts/@arch-platform/contracts/0.2.1/arch-platform-contracts-0.2.1.tgz',
  size: 8572,
  package: {
    name: '@arch-platform/contracts',
    version: '0.2.1',
    filesInside: ['package/package.json', 'package/dist/index.js'],
  },
  integrity: {
    calculated: 'sha512-test-contracts',
  },
};

const contractsPackage: PackageDescriptor = {
  name: '@arch-platform/contracts',
  rootPath: 'packages/contracts',
  manifestPath: 'packages/contracts/package.json',
  manifest: {
    name: '@arch-platform/contracts',
    version: '0.2.1',
    arch: {
      artifactType: 'declaration',
    },
  },
  internalDependencies: [],
  layout: undefined,
};

const generatorInspection: PackedArtifactInspect = {
  artifactRegistryStatus: 'not-registered',
  artifact: 'arch-platform-generator-mvc-0.1.0.tgz',
  file: 'artifacts/@arch-platform/generator-mvc/0.1.0/arch-platform-generator-mvc-0.1.0.tgz',
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

const generatorPackage: PackageDescriptor = {
  name: '@arch-platform/generator-mvc',
  rootPath: 'packages/generator-mvc',
  manifestPath: 'packages/generator-mvc/package.json',
  manifest: {
    name: '@arch-platform/generator-mvc',
    version: '0.1.0',
    arch: {
      artifactType: 'runtime',
    },
  },
  internalDependencies: [],
  layout: undefined,
};

function createWriter(): ArtifactDistributionPreparedWriter {
  return {
    apply: vi.fn(),
    write: vi.fn().mockResolvedValue(undefined),
    getState: vi.fn(),
  };
}

function createPathService(): PathService {
  return {
    join: (...segments: string[]) => segments.join('/'),
  } as PathService;
}

describe('InspectArtifactUseCase', () => {
  it('inspects the exact artifact path for the requested package version', async () => {
    const reader: PackedReader = {
      read: vi.fn().mockResolvedValue(contractsInspection),
    };
    const writer = createWriter();

    const useCase = new InspectArtifactUseCase(
      reader,
      writer,
      'artifacts',
      [contractsPackage],
      createPathService(),
    );

    const result = await useCase.execute({
      artifact: '@arch-platform/contracts',
    });

    expect(result).toEqual({
      success: true,
      durationMs: expect.any(Number),
      artifact: '@arch-platform/contracts',
      inspection: contractsInspection,
    });

    expect(reader.read).toHaveBeenCalledWith(
      'artifacts/@arch-platform/contracts/0.2.1/arch-platform-contracts-0.2.1.tgz',
    );

    expect(writer.apply).toHaveBeenCalledWith({
      artifactRegistryStatus: 'registered',
      artifact: 'arch-platform-contracts-0.2.1.tgz',
      file: 'artifacts/@arch-platform/contracts/0.2.1/arch-platform-contracts-0.2.1.tgz',
      packageName: '@arch-platform/contracts',
      version: '0.2.1',
      integrityCalculated: true,
      integrityMatches: undefined,
      integrityResolved: false,
    });

    expect(writer.write).toHaveBeenCalledOnce();
  });

  it('inspects the requested package rather than another package', async () => {
    const reader: PackedReader = {
      read: vi.fn().mockResolvedValue(generatorInspection),
    };
    const writer = createWriter();

    const useCase = new InspectArtifactUseCase(
      reader,
      writer,
      'artifacts',
      [contractsPackage, generatorPackage],
      createPathService(),
    );

    const result = await useCase.execute({
      artifact: '@arch-platform/generator-mvc',
    });

    expect(result.inspection).toEqual(generatorInspection);
    expect(reader.read).toHaveBeenCalledWith(
      'artifacts/@arch-platform/generator-mvc/0.1.0/arch-platform-generator-mvc-0.1.0.tgz',
    );

    expect(writer.apply).toHaveBeenCalledWith({
      artifactRegistryStatus: 'not-registered',
      artifact: 'arch-platform-generator-mvc-0.1.0.tgz',
      file: 'artifacts/@arch-platform/generator-mvc/0.1.0/arch-platform-generator-mvc-0.1.0.tgz',
      packageName: '@arch-platform/generator-mvc',
      version: '0.1.0',
      integrityCalculated: true,
      integrityMatches: undefined,
      integrityResolved: false,
    });

    expect(writer.write).toHaveBeenCalledOnce();
  });

  it('fails when the requested package does not exist', async () => {
    const reader: PackedReader = {
      read: vi.fn(),
    };
    const writer = createWriter();

    const useCase = new InspectArtifactUseCase(
      reader,
      writer,
      'artifacts',
      [contractsPackage],
      createPathService(),
    );

    await expect(
      useCase.execute({
        artifact: '@arch-platform/code-analysis',
      }),
    ).rejects.toThrow('Packed artifact "@arch-platform/code-analysis" was not found');

    expect(reader.read).not.toHaveBeenCalled();
    expect(writer.apply).not.toHaveBeenCalled();
    expect(writer.write).not.toHaveBeenCalled();
  });

  it('fails when the packed artifact identity does not match the requested version', async () => {
    const reader: PackedReader = {
      read: vi.fn().mockResolvedValue({
        ...contractsInspection,
        package: {
          ...contractsInspection.package,
          version: '0.2.0',
        },
      }),
    };
    const writer = createWriter();

    const useCase = new InspectArtifactUseCase(
      reader,
      writer,
      'artifacts',
      [contractsPackage],
      createPathService(),
    );

    await expect(
      useCase.execute({
        artifact: '@arch-platform/contracts',
      }),
    ).rejects.toThrow('Packed artifact identity mismatch');

    expect(writer.apply).not.toHaveBeenCalled();
    expect(writer.write).not.toHaveBeenCalled();
  });
});
