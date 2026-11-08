// packages/application/src/generation/templates/resolve-template-output-path.ts

import { compile } from 'handlebars';

import type { NamedVariables } from '@arch-platform/contracts';

export function resolveTemplateOutputPath(
  output: string,

  variables: NamedVariables,
): string {
  return compile(output)(variables);
}
