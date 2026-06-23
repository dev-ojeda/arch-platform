// packages/core/variables/build-variables.ts

import {
  getStringVariable,
  type GenerationContext,
  type LanguageConvention,
  type ResolvedTemplateVariables,
  type TemplateVariables,
} from '@arch/contracts';

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
