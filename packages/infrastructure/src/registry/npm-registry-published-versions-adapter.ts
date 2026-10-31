// packages/infrastructure/src/registry/npm-registry-published-versions-adapter.ts

import type {
  RegistryPublishedPackage,
  RegistryPublishedVersions,
  RegistryPublishedVersionsAdapterPort,
  RegistryPublishedVersionsByScope,
} from '@arch-platform/platform-model';

import { SemanticVersionCalculator } from '../versioning/semantic-version-calculator.js';

import { knownPackages } from './registry-know-packages.js';

interface NpmPackageRootMetadata {
  name: string;
  'dist-tags': Record<string, string>;
  versions: Record<
    string,
    {
      name: string;
      version: string;
      dist?: {
        integrity?: string;
        tarball?: string;
      };
    }
  >;
}

/**
 * Estructura de respuesta del endpoint de búsqueda de NPM
 */
interface NpmSearchResponse {
  objects: {
    package: {
      name: string;
    };
  }[];
}

export class NpmRegistryPublishedVersionsAdapter implements RegistryPublishedVersionsAdapterPort {
  private readonly calculator = new SemanticVersionCalculator();

  constructor(private readonly registryUrl = 'https://registry.npmjs.org') {}

  /**
   * Obtiene el histórico completo y los metadatos de distribución de un único paquete.
   */
  async fetchPublishedVersions(
    packageName: string,
  ): Promise<RegistryPublishedVersions | undefined> {
    const packagePath = this.escapePackageName(packageName);
    const url = `${this.registryUrl}/${packagePath}`;

    const response = await fetch(url);

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch registry metadata for "${packageName}": ${response.status} ${response.statusText}`,
      );
    }

    const rootMetadata = (await response.json()) as NpmPackageRootMetadata;

    const rawVersionKeys = Object.keys(rootMetadata.versions ?? {});
    const sortedVersions = this.calculator.sortDescending(rawVersionKeys);

    const versions: RegistryPublishedPackage['versions'] = {};

    for (const version of sortedVersions) {
      const metadata = rootMetadata.versions[version];

      if (!metadata) {
        continue;
      }

      versions[version] = {
        name: metadata.name,
        version: metadata.version,
        prereleaseTag: this.calculator.getPrereleaseTag(version),
        dist: {
          integrity: metadata.dist?.integrity,
          tarball: metadata.dist?.tarball,
        },
      };
    }

    const publishedPackage: RegistryPublishedPackage = {
      packageName: rootMetadata.name,
      'dist-tags': rootMetadata['dist-tags'] ?? {},
      versions,
    };

    return {
      schemaVersion: 1,
      registry: this.registryUrl,
      synchronizedAt: new Date().toISOString(),
      package: publishedPackage,
    };
  }

  /**
   * Obtiene el histórico y metadatos de todos los paquetes publicados bajo un scope específico.
   */
  async fetchPublishedVersionsByScope(
    scopeName: string,
  ): Promise<RegistryPublishedVersionsByScope> {
    const cleanScope = scopeName.startsWith('@') ? scopeName.slice(1) : scopeName;

    let packageNames: string[];

    // Estrategia de paquetes conocidos para el scope interno.
    if (cleanScope === 'arch-platform') {
      packageNames = knownPackages;
    } else {
      const expectedPrefix = `@${cleanScope}/`;
      const searchUrl = `${this.registryUrl}/-/v1/search?text=scope:${encodeURIComponent(cleanScope)}&size=250`;

      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        throw new Error(
          `Failed to search scope "${scopeName}": ${searchResponse.status} ${searchResponse.statusText}`,
        );
      }

      const searchData = (await searchResponse.json()) as NpmSearchResponse;

      packageNames = [
        ...new Set(
          (searchData.objects ?? [])
            .map((item) => item.package.name)
            .filter((name) => name.startsWith(expectedPrefix)),
        ),
      ];
    }

    const settlementResults = await Promise.allSettled(
      packageNames.map((name) => this.fetchPublishedVersions(name)),
    );

    const packages: RegistryPublishedPackage[] = [];

    for (const item of settlementResults) {
      if (item.status === 'fulfilled' && item.value !== undefined) {
        packages.push(item.value.package);
      } else if (item.status === 'rejected') {
        console.warn('Sincronización parcial interrumpida para un paquete:', item.reason);
      }
    }

    return {
      schemaVersion: 1,
      registry: this.registryUrl,
      synchronizedAt: new Date().toISOString(),
      packages,
    };
  }

  private escapePackageName(packageName: string): string {
    if (packageName.startsWith('@')) {
      const [scope, name] = packageName.split('/');

      if (!scope || !name) {
        return encodeURIComponent(packageName);
      }

      return `${encodeURIComponent(scope)}/${encodeURIComponent(name)}`;
    }

    return encodeURIComponent(packageName);
  }
}
