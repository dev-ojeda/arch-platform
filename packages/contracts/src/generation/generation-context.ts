// packages/contracts/src/generation/generation-context.ts
import type { GenerationDiagnostic } from "../diagnostics/generation-diagnostic.js";
import type { GenerationEventBus } from "../events/generation-event-bus.js";
import type { FileSystemPort } from "../filesystem/filesystem.port.js";
import type { GeneratedFile } from "../generation/generated-file.js";
import type { GeneratorDefinition } from "../generators/generator-definition.js";

import type { LoggerPort } from "../logging/logger.port.js";
import type { ResolvedTemplate } from "../pipeline/resolved-template.js";

import type { TechnologyStack } from "../stacks/technology-stack.js";
import type { StepExecutionMetric } from "../telemetry/step-execution-metric.js";
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
   * Runtime Services
   */

  readonly logger: LoggerPort;

  readonly eventBus: GenerationEventBus;
  /*
   * Infrastructure
   */

  readonly fs: FileSystemPort;

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

  metadata: Map<string, unknown>;

  /*
   * Runtime Diagnostics
   */
  diagnostics: GenerationDiagnostic[];

  /*
   * Runtime Metrics
   */
  metrics: StepExecutionMetric[];
}
