// packages\application\test\createResolvedTemplateVariables.ts

import type { ResolvedTemplateVariables } from '@arch/contracts';

import type { TemplateVariables } from '../src/generation/variables/derive-template-variables.js';

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
