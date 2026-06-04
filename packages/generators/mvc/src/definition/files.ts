// packages\generators\mvc\src\definition\files.ts
import type { FileDefinition, ResolvedTemplateVariables } from '@arch/contracts/templates';

import type { MvcVariables } from '../variables/mvc.variables.js';

export const mvcFiles: readonly FileDefinition<ResolvedTemplateVariables<MvcVariables>>[] = [
  {
    template: 'frameworks/express/controller.hbs',

    output: '{{folderLayout.controller}}/{{controllerName}}{{fileExtension}}',
  },

  {
    template: 'frameworks/express/service.hbs',

    output: '{{folderLayout.service}}/{{serviceName}}{{fileExtension}}',
  },

  {
    template: 'frameworks/express/repository.hbs',

    output: '{{folderLayout.repository}}/{{repositoryName}}{{fileExtension}}',
  },

  {
    template: 'frameworks/express/model.hbs',

    output: '{{folderLayout.model}}/{{modelName}}{{fileExtension}}',
  },
];
