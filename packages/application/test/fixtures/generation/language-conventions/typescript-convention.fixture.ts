import type { LanguageConvention } from '@arch-platform/contracts';

export const typescriptConvention: LanguageConvention = {
  id: 'typescript',
  fileExtension: '.ts',
  folderLayout: {
    controller: 'controllers',
    service: 'services',
    repository: 'repositories',
    model: 'models',
  },
  formatName: (name) => name.charAt(0).toUpperCase() + name.slice(1),
  controllerName: (name) => `${name}Controller`,
  serviceName: (name) => `${name}Service`,
  repositoryName: (name) => `${name}Repository`,
  modelName: (name) => name.charAt(0).toUpperCase() + name.slice(1),
};
