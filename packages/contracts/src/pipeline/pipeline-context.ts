import type { GeneratorDefinition } from "../generators/generator-definition.js"


export interface PipelineContext {

  generatorId: string

  generator?: GeneratorDefinition

  variables: Record<string, unknown>

  workspacePath: string
}