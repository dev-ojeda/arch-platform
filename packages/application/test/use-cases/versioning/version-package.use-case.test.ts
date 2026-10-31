import { describe, expect, it, vi } from 'vitest';

import { SemanticVersionCalculator } from '@arch-platform/infrastructure';
import type {
  PackageDescriptor,
  PackageVersionWriter,
  RegistryPublishedVersions,
  RegistryPublishedVersionsReader,
} from '@arch-platform/platform-model';

import { VersionPackageUseCase } from '../../../src/use-cases/versioning/version-package.use-case.js';

const packageName = '@arch-platform/generator-mvc';
const manifestPath = '/packages/generators/mvc/package.json';

function createPackageDescriptor(version?: string): PackageDescriptor {
  return {
    name: packageName,
    rootPath: '/packages/generators/mvc',
    manifestPath,
    manifest: {
      name: packageName,
      ...(version === undefined ? {} : { version }),
      arch: undefined,
    },
    internalDependencies: [],
    layout: {} as PackageDescriptor['layout'],
  };
}

function createWriter(): PackageVersionWriter {
  return {
    write: vi.fn().mockResolvedValue(undefined),
  };
}

function createRegistryState(versions: string[]): RegistryPublishedVersions {
  return {
    schemaVersion: 1,
    registry: 'https://registry.npmjs.org',
    synchronizedAt: '2026-10-14T00:00:00.000Z',
    package: {
      packageName,
      'dist-tags': {},
      versions: Object.fromEntries(
        versions.map((version) => [
          version,
          {
            name: packageName,
            version,
          },
        ]),
      ),
    },
  };
}

function createRegistryReader(versions: string[] = []): RegistryPublishedVersionsReader {
  return {
    read: vi
      .fn()
      .mockResolvedValue(versions.length > 0 ? createRegistryState(versions) : undefined),
  };
}

function createUseCase(version: string | undefined, versions: string[] = []) {
  const writer = createWriter();
  const registryReader = createRegistryReader(versions);

  const useCase = new VersionPackageUseCase(
    createPackageDescriptor(version),
    new SemanticVersionCalculator(),
    writer,
    registryReader,
  );

  return { useCase, writer, registryReader };
}

describe('VersionPackageUseCase', () => {
  it('calculates and writes the next patch version without a registry catalog', async () => {
    const { useCase, writer, registryReader } = createUseCase('0.1.1');

    const result = await useCase.execute({
      packageName,
      releaseType: 'patch',
    });

    expect(result).toMatchObject({
      success: true,
      artifact: packageName,
      releaseType: 'patch',
      currentVersion: '0.1.1',
      nextVersion: '0.1.2',
    });

    expect(result.durationMs).toEqual(expect.any(Number));
    expect(registryReader.read).toHaveBeenCalledWith(packageName);
    expect(writer.write).toHaveBeenCalledOnce();
    expect(writer.write).toHaveBeenCalledWith(manifestPath, '0.1.2');
  });

  it('calculates a prerelease using the requested tag', async () => {
    const { useCase, writer } = createUseCase('0.1.1');

    const result = await useCase.execute({
      packageName,
      releaseType: 'prepatch',
      tagName: 'dev',
    });

    expect(result.nextVersion).toBe('0.1.2-dev.0');
    expect(writer.write).toHaveBeenCalledWith(manifestPath, '0.1.2-dev.0');
  });

  it('uses the latest stable published version when it is higher than the local version', async () => {
    const { useCase, writer } = createUseCase('0.1.1', ['0.1.2', '0.1.5', '0.2.0-dev.0']);

    const result = await useCase.execute({
      packageName,
      releaseType: 'patch',
    });

    expect(result.currentVersion).toBe('0.1.1');
    expect(result.nextVersion).toBe('0.1.6');
    expect(writer.write).toHaveBeenCalledWith(manifestPath, '0.1.6');
  });

  it('ignores published prereleases when selecting the stable base version', async () => {
    const { useCase, writer } = createUseCase('0.1.1', ['0.1.2-dev.0', '0.2.0-alpha.1']);

    const result = await useCase.execute({
      packageName,
      releaseType: 'patch',
    });

    expect(result.nextVersion).toBe('0.1.2');
    expect(writer.write).toHaveBeenCalledWith(manifestPath, '0.1.2');
  });

  it('keeps the local version when it is higher than the published stable version', async () => {
    const { useCase, writer } = createUseCase('0.2.0', ['0.1.5', '0.1.8']);

    const result = await useCase.execute({
      packageName,
      releaseType: 'patch',
    });

    expect(result.nextVersion).toBe('0.2.1');
    expect(writer.write).toHaveBeenCalledWith(manifestPath, '0.2.1');
  });

  it('fails when the package has no current version', async () => {
    const { useCase, writer, registryReader } = createUseCase(undefined);

    await expect(
      useCase.execute({
        packageName,
        releaseType: 'patch',
      }),
    ).rejects.toThrow(`Package "${packageName}" does not have a current version`);

    expect(registryReader.read).not.toHaveBeenCalled();
    expect(writer.write).not.toHaveBeenCalled();
  });
});
