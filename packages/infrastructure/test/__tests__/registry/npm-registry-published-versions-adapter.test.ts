// packages/infrastructure/test/__tests__/registry/npm-registry-published-versions-adapter.test.ts
import { describe, expect, it } from 'vitest';

import { NpmRegistryPublishedVersionsAdapter } from '@arch-platform/infrastructure';

describe('NpmRegistryPublishedVersionsAdapter', () => {
  const readerNpm = new NpmRegistryPublishedVersionsAdapter();

  // 1. CASO ÉXITO: Un paquete específico
  it('should fetch published versions for a specific package', async () => {
    const result = await readerNpm.fetchPublishedVersions('@arch-platform/contracts');

    expect(result).toBeDefined();
    expect(result?.schemaVersion).toBe(1);
    expect(result?.package).toBeDefined();
    expect(result?.package.packageName).toBe('@arch-platform/contracts');

    // Validamos que contenga el historial de versiones mapeado como objeto
    const versions = result?.package.versions;
    expect(versions).toBeDefined();
    expect(Object.keys(versions || {}).length).toBeGreaterThan(0);
  });

  // 2. CASO ÉXITO: Todo un scope/organización (Múltiples paquetes)
  it('should fetch all packages published under a specific scope', async () => {
    const packagesInScope = await readerNpm.fetchPublishedVersionsByScope('arch-platform');
    expect(Array.isArray(packagesInScope.packages)).toBe(true);
    expect(packagesInScope.packages.length).toBeGreaterThan(0);
    expect(packagesInScope.packages.map((pkg) => pkg.packageName)).toEqual(
      expect.arrayContaining([
        '@arch-platform/contracts',
        '@arch-platform/generator-mvc',
        '@arch-platform/distribution',
      ]),
    );
  }, 15000);

  // 3. CASO CONTROL DE ERRORES: Paquete que no existe (404)
  it('should return undefined when a package does not exist', async () => {
    const result = await readerNpm.fetchPublishedVersions('@arch-platform/unexisting-package-xyz');
    expect(result).toBeUndefined();
  });

  // 4. CASO CONTROL DE ERRORES: Scope que no existe
  it('should return an empty packages collection when a scope does not exist', async () => {
    const results = await readerNpm.fetchPublishedVersionsByScope('unexisting-scope-at-all-xyz');

    expect(results.packages).toEqual([]);
  });
});
