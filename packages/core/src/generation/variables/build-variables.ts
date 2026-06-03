// packages/core/variables/build-variables.ts
import type { GenerationContext } from '@arch/contracts/generation';
import type { LanguageConvention } from '@arch/contracts/languages';
import type { ResolvedTemplateVariables } from '@arch/contracts/templates';
import { getStringVariable, type TemplateVariables } from '@arch/contracts/variables';

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
