// packages\contracts\src\pipeline\pipeline-context.ts
import type { GeneratorDefinition } from "../generators/generator-definition.js"
import type { GenerationContext } from "../runtime/generation-context.js"
import type {
  ResolvedTemplate
}
from './resolved-template.js'

/**
 * Shared mutable state used across
 * generation pipeline execution.
 */
export interface PipelineContext
extends GenerationContext {

  /**
   * Target generator identifier.
   */
  generatorId: string

  /**
   * Loaded generator definition.
   */
  generator?:
  GeneratorDefinition

  /**
   * Resolved execution plan for templates/files.
   */
  resolvedTemplates?:
  readonly ResolvedTemplate[]
}