// packages/application/src/generation/variables/derive-template-variables.ts

import {
  type GenerationContext,
  type LanguageConvention,
  type NamedVariables,
  type ResolvedTemplateVariables,
  type VariableValue,
} from '@arch/contracts';

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

export function buildVariables<TVariables extends TemplateVariables>(
  ctx: GenerationContext<TVariables>,

  language: LanguageConvention,
): ResolvedTemplateVariables<TVariables> {
  const resourceName = getStringVariable(ctx.variables.name, 'name');
  return {
    ...ctx.variables,

    className: language.formatName(resourceName),

    controllerName: language.controllerName(resourceName),

    serviceName: language.serviceName(resourceName),

    repositoryName: language.repositoryName(resourceName),

    modelName: language.modelName(resourceName),

    fileExtension: language.fileExtension,

    folderLayout: language.folderLayout,
  };
}

export function getStringVariable(value: VariableValue, variableName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Variable "${variableName}" must be a string`);
  }

  return value;
}
