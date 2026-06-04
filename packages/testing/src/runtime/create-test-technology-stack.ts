// packages/testing/src/runtime/create-test-technology-stack.ts

import type { TechnologyStack } from '@arch/contracts/stacks';

export function createTestTechnologyStack(): TechnologyStack {
  return {
    languageId: 'typescript',

    frameworkId: 'test-framework',
  };
}
