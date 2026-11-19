// packages\application\test\createResolvedTemplateVariables.ts

import type { ResolvedTemplateVariables, TemplateVariables } from '@arch-platform/contracts';

export function createResolvedTemplateVariables(
  overrides: Partial<ResolvedTemplateVariables<TemplateVariables>> = {},
): ResolvedTemplateVariables<TemplateVariables> {
  return {
    name: 'user',

    className: 'User',

    controllerName: 'UserController',

    serviceName: 'UserService',

    repositoryName: 'UserRepository',

    modelName: 'User',

    fileExtension: '.ts',

    folderLayout: {
      controller: 'controllers',

      service: 'services',

      repository: 'repositories',

      model: 'models',
    },

    ...overrides,
  };
}
