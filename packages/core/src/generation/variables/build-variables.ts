// packages/core/variables/build-variables.ts
import type {
  GenerationContext,
  LanguageConvention,
  NamedVariables,
  ResolvedTemplateVariables,
} from '@arch/contracts';

export function buildVariables<TVariables extends NamedVariables>(
  ctx: GenerationContext<TVariables>,

  language: LanguageConvention,
): ResolvedTemplateVariables<TVariables> {
  const resourceName = String(ctx.variables.name);

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
