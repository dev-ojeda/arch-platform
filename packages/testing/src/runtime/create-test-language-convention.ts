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

  formatName: (name: string): string => name,

  controllerName: (name: string): string => `${name}Controller`,

  serviceName: (name: string): string => `${name}Service`,

  repositoryName: (name: string): string => `${name}Repository`,

  modelName: (name: string): string => `${name}Model`,
};
