// packages/infrastructure/src/versioning/semantic-version-calculator.ts
import type { ReleaseType } from 'semver';
import { compare, inc, prerelease, rsort, valid } from 'semver';

export class SemanticVersionCalculator {
  /**
   * Compara dos strings de versión (formato X.Y.Z)
   */
  public compare(v1: string, v2: string): number {
    if (!valid(v1) || !valid(v2)) {
      throw new Error(`Una o ambas versiones no son válidas: "${v1}", "${v2}"`);
    }
    return compare(v1, v2);
  }

  /**
   * Ordena un arreglo de versiones de la más reciente a la más antigua (descendente)
   */
  public sortDescending(versions: string[]): string[] {
    const validVersions = versions.filter((v) => valid(v));
    return rsort(validVersions);
  }

  /**
   * Obtiene la versión más alta (última) de un listado de versiones
   */
  public getLatest(versions: string[]): string | undefined {
    const sorted = this.sortDescending(versions);
    return sorted[0];
  }

  /**
   * Obtiene el nombre del tag (prerelease identifier) de una versión.
   * Devuelve el string del tag (ej: "dev", "alpha") o undefined si es una versión estable.
   */
  public getPrereleaseTag(version: string): string | undefined {
    if (!valid(version)) {
      return undefined;
    }

    const components = prerelease(version);

    // Si existen componentes (ej: ['dev', 0]), comprobamos si el primer elemento es el identificador string
    if (components && components.length > 0 && typeof components[0] === 'string') {
      return components[0];
    }

    return undefined;
  }

  /**
   * Calcula la siguiente versión lógica a publicar a partir de una versión base.
   */
  public nextRelease(current: string, type: ReleaseType, identifier?: string): string {
    const next = inc(current, type, undefined, identifier);

    if (!next) {
      throw new Error(
        `No se pudo calcular la siguiente versión para "${current}" con el tipo "${String(type)}"`,
      );
    }

    return next;
  }

  public getLatestStable(versions: string[]): string | undefined {
    const stableVersions = versions.filter(
      (version) => valid(version) !== null && prerelease(version) === null,
    );

    return this.getLatest(stableVersions);
  }
}
