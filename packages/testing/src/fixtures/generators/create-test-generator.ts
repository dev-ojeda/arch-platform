// packages/testing/src/fixtures/generators/create-test-generator.ts

import type { GeneratorDefinition } from "@arch/contracts";

export function createTestGenerator(
  overrides: Partial<GeneratorDefinition> = {}
): GeneratorDefinition {
  return {
    descriptor: {
      id: "test-generator",

      displayName: "Test Generator",

      version: "1.0.0",

      languages: ["typescript"],

      frameworks: ["vitest"],
    },

    schema: {
      id: "test-schema",

      title: "Test Schema",

      fields: [],
    },

    templates: [
      {
        template: "service.hbs",

        output: "{{folderLayout.service}}/{{serviceName}}{{fileExtension}}",
      },
    ],

    ...overrides,
  };
}
