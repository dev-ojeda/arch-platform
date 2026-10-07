// packages/infrastructure/src/versioning/semantic-version-calculator.ts
import type { ReleaseType } from 'semver';
import { compare, inc, rsort } from 'semver';

export class SemanticVersionCalculator {
  /**
   * Compara dos strings de versión (formato X.Y.Z)
   * Devuelve:
   *    1 si v1 es mayor que v2 (v1 > v2)
   *   -1 si v1 es menor que v2 (v1 < v2)
   *    0 si son exactamente iguales (v1 === v2)
   */
  public compare(v1: string, v2: string): number {
    return compare(v1, v2);
  }

  /**
   * Ordena un arreglo de versiones de la más reciente a la más antigua (descendente)
   */
  public sortDescending(versions: string[]): string[] {
    // rsort ordena automáticamente de mayor a menor manejando correctamente pre-releases
    return rsort(versions);
  }

  /**
   * Obtiene la versión más alta (última) de un listado de versiones
   */
  public getLatest(versions: string[]): string | undefined {
    return versions.reduce<string | undefined>((latest, current) => {
      if (latest === undefined) {
        return current;
      }

      return compare(current, latest) > 0 ? current : latest;
    }, undefined);
  }

  /**
   * Calcula la siguiente versión lógica a publicar a partir de una versión base
   * @param current La versión actual (ej: "0.1.0")
   * @param type El tipo de incremento deseado ('major', 'minor', 'patch', 'prerelease', etc.)
   * @returns La nueva versión en formato string (ej: "0.1.1")
   */
  public nextRelease(current: string, type: ReleaseType): string {
    const next = inc(current, type);

    if (!next) {
      throw new Error(
        `No se pudo calcular la siguiente versión para "${current}" con el tipo "${String(type)}"`,
      );
    }

    return next;
  }
}
