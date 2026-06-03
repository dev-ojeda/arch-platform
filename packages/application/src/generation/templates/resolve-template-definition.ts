// packages/application/src/generation/templates/resolve-template-definition.ts
import type { ResolvedFileDefinition, ResolvedTemplate } from '@arch/contracts/pipeline';
import type { FileDefinition } from '@arch/contracts/templates';
import type { NamedVariables } from '@arch/contracts/variables';

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
