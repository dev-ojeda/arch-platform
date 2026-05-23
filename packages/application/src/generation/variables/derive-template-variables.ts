// packages/application/src/generation/variables/derive-template-variables.ts

import type { NamedVariables, ResolvedTemplateVariables } from '@arch/contracts';

export function deriveTemplateVariables(
  variables: NamedVariables,
): ResolvedTemplateVariables<NamedVariables> {
  const name = String(variables.name ?? '');

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
