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

  constructor(private readonly registryUrl = 'https://registry.npmjs.org') {}

  /**
   * Busca los metadatos de una versión específica de un paquete
   */
  async find(
    packageName: string,
    version: string,
  ): Promise<ArtifactRegistryPublishing | undefined> {
    const packagePath = this.escapePackageName(packageName);
    const url = `${this.registryUrl}/${packagePath}/${encodeURIComponent(version)}`;

    const response = await fetch(url);
    if (response.status === 404) return undefined;
    if (!response.ok) {
      throw new Error(`Npm registry request failed: ${response.status} ${response.statusText}`);
    }

    const metadata = (await response.json()) as {
      name: string;
      version: string;
      dist?: {
        integrity?: string;
        tarball?: string;
      };
    };

    const artifactRegistryPublishing = {
      packageName: metadata.name,
      version: metadata.version,
      integrity: metadata.dist?.integrity,
      tarball: metadata.dist?.tarball,
      tag: this.calculator.getPrereleaseTag(metadata.version),
    };

    return artifactRegistryPublishing;
  }

  /**
   * Consulta todas las versiones de un paquete y las devuelve mapeadas
   * y ordenadas de la más reciente a la más antigua (descendente).
   */
  async findAll(packageName: string): Promise<readonly ArtifactRegistryPublishing[]> {
    const packagePath = this.escapePackageName(packageName);
    const url = `${this.registryUrl}/${packagePath}`;

    const response = await fetch(url);
    if (response.status === 404) return [];
    if (!response.ok) {
      throw new Error(`Npm registry request failed: ${response.status} ${response.statusText}`);
    }

    const rootMetadata = (await response.json()) as NpmPackageRootMetadata;
    const rawVersions = Object.keys(rootMetadata.versions);
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

    const response = await fetch(url);
    if (response.status === 404) return undefined;
    if (!response.ok) {
      throw new Error(`Npm registry request failed: ${response.status} ${response.statusText}`);
    }

    const rootMetadata = (await response.json()) as NpmPackageRootMetadata;

    const tagVersion: unknown = rootMetadata['dist-tags']?.[distTag];
    let latestVersionString: string | undefined =
      typeof tagVersion === 'string' ? tagVersion : undefined;

    if (!latestVersionString) {
      const versionList = Object.keys(rootMetadata.versions);
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
