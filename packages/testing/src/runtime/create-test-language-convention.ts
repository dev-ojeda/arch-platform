// packages/testing/src/runtime/create-test-language-convention.ts

import type { LanguageConvention } from '@arch/contracts';

export const testLanguageConvention: LanguageConvention = {
  id: 'typescript',

  fileExtension: 'ts',

  folderLayout: {
    controller: 'controllers',

    service: 'services',

    repository: 'repositories',

    model: 'models',
  },

  formatName: (name: any) => name,

  controllerName: (name: any) => `${name}Controller`,

  serviceName: (name: any) => `${name}Service`,

  repositoryName: (name: any) => `${name}Repository`,

  modelName: (name: any) => `${name}Model`,
};
