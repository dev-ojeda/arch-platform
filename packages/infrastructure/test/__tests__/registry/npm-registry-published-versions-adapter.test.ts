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
    expect(result?.packages[0]).toBeDefined();
    expect(result?.packages[0].packageName).toBe('@arch-platform/contracts');

    // Validamos que contenga el historial de versiones mapeado como objeto
    const versions = result?.packages[0].versions;
    expect(versions).toBeDefined();
    expect(Object.keys(versions || {}).length).toBeGreaterThan(0);
  });

  // 2. CASO ÉXITO: Todo un scope/organización (Múltiples paquetes)
  it('should fetch all packages published under a specific scope', async () => {
    const packagesInScope = await readerNpm.fetchPublishedVersionsByScope('arch-platform');

    expect(Array.isArray(packagesInScope)).toBe(true);
    expect(packagesInScope.length).toBeGreaterThan(0);

    console.log(`Total de contenedores de sincronización en el scope: ${packagesInScope.length}`);

    // Iteramos de forma segura por todos los paquetes devueltos en el scope
    for (const container of packagesInScope) {
      expect(container.schemaVersion).toBe(1);
      const pkg = container.packages[0];
      expect(pkg).toBeDefined();
      console.log(
        `-> Procesado exitosamente: ${pkg.packageName} con ${Object.keys(pkg.versions).length} versiones.`,
      );

      // Verificamos que se esté extrayendo correctamente el dist-tag principal
      expect(pkg['dist-tags']).toHaveProperty('latest');
    }
  }, 15000);

  // 3. CASO CONTROL DE ERRORES: Paquete que no existe (404)
  it('should return undefined when a package does not exist', async () => {
    const result = await readerNpm.fetchPublishedVersions('@arch-platform/unexisting-package-xyz');
    expect(result).toBeUndefined();
  });

  // 4. CASO CONTROL DE ERRORES: Scope que no existe
  it('should return an empty array when a scope does not exist', async () => {
    const results = await readerNpm.fetchPublishedVersionsByScope('unexisting-scope-at-all-xyz');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });
});
