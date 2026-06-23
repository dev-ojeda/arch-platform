// packages/application/src/generation/templates/resolve-template-definition.ts

import type {
  FileDefinition,
  NamedVariables,
  ResolvedFileDefinition,
  ResolvedTemplate,
} from '@arch/contracts';

import { resolveTemplateOutputPath } from './resolve-template-output-path.js';

export function resolveTemplateDefinition<TVariables extends NamedVariables>(
  template: FileDefinition<TVariables>,

  variables: TVariables,
): ResolvedTemplate<TVariables> {
  const outputPath = resolveTemplateOutputPath(
    template.output,

    variables,
  );

  const resolvedTemplate: ResolvedFileDefinition<TVariables> = {
    ...template,

    output: outputPath,
  };

  return {
    template: resolvedTemplate,

    outputPath,
  };
}
