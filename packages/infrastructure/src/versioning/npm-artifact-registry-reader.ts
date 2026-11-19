// packages/infrastructure/src/versioning/npm-artifact-registry-reader.ts
import type {
  ArtifactRegistryPublishing,
  ArtifactRegistryPublishingReader,
} from '@arch-platform/platform-model';

import { SemanticVersionCalculator } from './semantic-version-calculator.js';

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

// Extendemos la interfaz del dominio para añadir el campo 'tag' en esta infraestructura
export interface NpmArtifactRegistryPublishing extends ArtifactRegistryPublishing {
  readonly tag?: string;
}

export class NpmArtifactRegistryReader implements ArtifactRegistryPublishingReader {
  private readonly calculator = new SemanticVersionCalculator();
  private readonly registryUrl: string;

  constructor(
    registryUrl = 'https://registry.npmjs.org',
    private readonly requestTimeoutMs = 10_000,
  ) {
    this.registryUrl = registryUrl.replace(/\/+$/, '');
  }

  /**
   * Busca los metadatos de una versión específica de un paquete
   * leyendo el manifiesto raíz del paquete (igual que arch sync).
   */
  async find(
    packageName: string,
    version: string,
  ): Promise<ArtifactRegistryPublishing | undefined> {
    if (!version.trim()) {
      return undefined;
    }
    const packagePath = this.escapePackageName(packageName);
    const url = `${this.registryUrl}/${packagePath}`;

    const rootMetadata = await this.fetchJsonOrUndefined<NpmPackageRootMetadata>(url);
    if (!rootMetadata) {
      return undefined;
    }

    const metadata = rootMetadata.versions?.[version];
    if (!metadata) {
      return undefined;
    }

    return {
      packageName: rootMetadata.name,
      version: metadata.version,
      integrity: metadata.dist?.integrity,
      tarball: metadata.dist?.tarball,
      tag: this.calculator.getPrereleaseTag(metadata.version),
    };
  }

  /**
   * Consulta todas las versiones de un paquete y las devuelve mapeadas
   * y ordenadas de la más reciente a la más antigua (descendente).
   */
  async findAll(packageName: string): Promise<readonly ArtifactRegistryPublishing[]> {
    const packagePath = this.escapePackageName(packageName);
    const url = `${this.registryUrl}/${packagePath}`;

    const rootMetadata = await this.fetchJsonOrUndefined<NpmPackageRootMetadata>(url);
    if (!rootMetadata) {
      return [];
    }

    const rawVersions = Object.keys(rootMetadata.versions ?? {});
    const sortedVersions = this.calculator.sortDescending(rawVersions);

    return sortedVersions.map((version) => {
      const versionMetadata = rootMetadata.versions[version];
      return {
        packageName: rootMetadata.name,
        version: version,
        integrity: versionMetadata?.dist?.integrity,
        tarball: versionMetadata?.dist?.tarball,
        tag: this.calculator.getPrereleaseTag(version),
      };
    });
  }

  /**
   * Obtiene la última versión publicada analizando el listado completo de NPM.
   */
  async getLatestSnapshot(
    packageName: string,
    distTag = 'latest',
  ): Promise<ArtifactRegistryPublishing | undefined> {
    const packagePath = this.escapePackageName(packageName);
    const url = `${this.registryUrl}/${packagePath}`;

    const rootMetadata = await this.fetchJsonOrUndefined<NpmPackageRootMetadata>(url);
    if (!rootMetadata) {
      return undefined;
    }

    const tagVersion: unknown = rootMetadata['dist-tags']?.[distTag];
    let latestVersionString: string | undefined =
      typeof tagVersion === 'string' ? tagVersion : undefined;

    if (!latestVersionString) {
      const versionList = Object.keys(rootMetadata.versions ?? {});
      latestVersionString = this.calculator.getLatest(versionList);
    }

    const latestVersionMetadata = latestVersionString
      ? rootMetadata.versions[latestVersionString]
      : undefined;

    if (!latestVersionString || !latestVersionMetadata) {
      return undefined;
    }

    return {
      packageName: rootMetadata.name,
      version: latestVersionString,
      integrity: latestVersionMetadata.dist?.integrity,
      tarball: latestVersionMetadata.dist?.tarball,
      tag: this.calculator.getPrereleaseTag(latestVersionString),
    };
  }

  /**
   * Ejecuta una petición GET asegurando el cierre inmediato del stream en 404 o errores HTTP.
   */
  private async fetchJsonOrUndefined<T>(url: string): Promise<T | undefined> {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(this.requestTimeoutMs),
    });

    if (response.status === 404) {
      await response.body?.cancel();
      return undefined;
    }

    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`Npm registry request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Maneja correctamente paquetes con scope (ej: @arch-platform/contracts)
   */
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
