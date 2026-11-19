// packages\core\src\languages\language-convention-registry.ts
import type {
  LanguageConvention,
  LanguageConventionRegistry as LanguageConventionRegistryPort,
} from '@arch-platform/contracts';

export class LanguageConventionRegistry implements LanguageConventionRegistryPort {
  readonly #registry = new Map<string, LanguageConvention>();

  register(convention: LanguageConvention): void {
    this.#registry.set(convention.id, convention);
  }

  get(id: string): LanguageConvention {
    const convention = this.#registry.get(id);

    if (convention) {
      return convention;
    }

    throw new Error(`Language '${id}' not supported`);
  }

  list(): LanguageConvention[] {
    return [...this.#registry.values()];
  }

  has(id: string): boolean {
    return this.#registry.has(id);
  }

  clear(): void {
    this.#registry.clear();
  }
}
