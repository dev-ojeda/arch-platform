// packages/application/src/generation/variables/derive-template-variables.ts

import type { ResolvedTemplateVariables } from '@arch/contracts/templates';
import { getStringVariable, type NamedVariables } from '@arch/contracts/variables';

export interface TemplateVariables extends NamedVariables {
  readonly name: string;
}

export function deriveTemplateVariables<TVariables extends TemplateVariables>(
  variables: TVariables,
): ResolvedTemplateVariables<TVariables> {
  const name = getStringVariable(variables.name, 'name');

  const pascal = name.charAt(0).toUpperCase() + name.slice(1);

  return {
    ...variables,

    className: pascal,

    controllerName: `${pascal}Controller`,

    serviceName: `${pascal}Service`,

    repositoryName: `${pascal}Repository`,

    modelName: pascal,

    fileExtension: '.ts',

    folderLayout: {
      controller: 'controllers',
      service: 'services',
      repository: 'repositories',
      model: 'models',
    },
  };
}
