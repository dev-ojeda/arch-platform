// packages\contracts\src\pipeline\pipeline-context.ts
import type { GeneratorDefinition } from "../generators/generator-definition.js";

import type { GenerationContext } from "../runtime/generation-context.js";

import type { ResolvedTemplate } from "./resolved-template.js";

import type { NamedVariables } from "../variables/named-variables.js";

import type { ResolvedTemplateVariables } from "../templates/resolved-template-variables.js";

export interface PipelineContext<
  TVariables extends NamedVariables = NamedVariables
> extends GenerationContext<TVariables> {
  generatorId: string;

  generator?: GeneratorDefinition<TVariables>;

  resolvedVariables?: ResolvedTemplateVariables<TVariables>;

  resolvedTemplates?: readonly ResolvedTemplate<
    ResolvedTemplateVariables<TVariables>
  >[];
}
