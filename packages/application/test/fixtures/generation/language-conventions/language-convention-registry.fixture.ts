import type { LanguageConvention, LanguageConventionRegistry } from '@arch-platform/contracts';
import { typescriptConvention } from './typescript-convention.fixture.js';

export function createTestLanguageConventionRegistry(
  conventions: readonly LanguageConvention[] = [typescriptConvention],
): LanguageConventionRegistry {
  return {
    get(id) {
      const convention = conventions.find((item) => item.id === id);

      if (!convention) {
        throw new Error(`Language '${id}' not supported`);
      }

      return convention;
    },

    list() {
      return [...conventions];
    },
  };
}
