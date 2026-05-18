// packages/testing/src/runtime/create-test-pipeline-context.ts

import type { LanguageConvention } from "@arch/contracts";

export const testLanguageConvention: LanguageConvention = {
  id: "typescript",

  fileExtension: "ts",

  folderLayout: {
    controller: "controllers",

    service: "services",

    repository: "repositories",

    model: "models",
  },

  formatName: (name) => name,

  controllerName: (name) => `${name}Controller`,

  serviceName: (name) => `${name}Service`,

  repositoryName: (name) => `${name}Repository`,

  modelName: (name) => `${name}Model`,
};
