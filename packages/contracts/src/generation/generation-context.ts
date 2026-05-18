// packages/contracts/src/generation/generation-context.ts
import type { FileSystemPort } from "../filesystem/filesystem.port.js";
import type { GeneratedFile } from "../generation/generated-file.js";
import type { GeneratorDefinition } from "../generators/generator-definition.js";

import type { LoggerPort } from "../logging/logger.port.js";
import type { ResolvedTemplate } from "../pipeline/resolved-template.js";

import type { TechnologyStack } from "../stacks/technology-stack.js";
import type { ResolvedTemplateVariables } from "../templates/resolved-template-variables.js";

import type { NamedVariables } from "../variables/named-variables.js";

export interface GenerationContext<
  TVariables extends NamedVariables = NamedVariables
> {
  /*
   * Request
   */

  readonly targetDir: string;

  readonly signal?: AbortSignal;

  /*
   * Infrastructure
   */

  readonly fs: FileSystemPort;

  readonly logger: LoggerPort;

  /*
   * Generator
   */

  generator?: GeneratorDefinition<TVariables>;

  /*
   * Variables
   */

  variables: TVariables;

  resolvedVariables?: ResolvedTemplateVariables<TVariables>;

  /*
   * Stack
   */

  stack?: TechnologyStack;

  /*
   * Templates
   */

  resolvedTemplates?: readonly ResolvedTemplate<
    ResolvedTemplateVariables<TVariables>
  >[];

  /*
   * Runtime Artifacts
   */

  files: GeneratedFile[];

  /*
   * Runtime Metadata
   */

  metadata?: Map<string, unknown>;
}
