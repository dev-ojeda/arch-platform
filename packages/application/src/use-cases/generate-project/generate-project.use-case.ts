// packages\application\src\application\use-cases\generate-project\generate-project.use-case.ts
import type {
  GeneratorDefinition,
  Logger,
  NamedVariables
} from '@arch/contracts'

import type {
  GeneratorRegistry
} from '@arch/core'

import type {
  GeneratorRuntime
} from '../../runtime/generator-runtime.js'

export interface GenerateProjectRequest {

  generatorId: string

  targetDir: string

  logger?: Logger

  signal?: AbortSignal
}

export class GenerateProjectUseCase {

  constructor(

      private readonly registry:
          GeneratorRegistry,

      private readonly runtime:
          GeneratorRuntime
  ) {}

  async execute(
      request:
          GenerateProjectRequest
  ): Promise<void> {

      const generator =
          this.registry.get(
              request.generatorId
          )

      if (!generator) {

          throw new Error(
              `Generator not found: ${request.generatorId}`
          )
      }

      await this.runGenerator(
          generator,
          request
      )
  }

  private async runGenerator<
      TVariables extends NamedVariables
  >(
      generator:
          GeneratorDefinition<TVariables>,

      request:
          GenerateProjectRequest
  ): Promise<void> {

      await this.runtime.execute(
          generator,
          {
              targetDir:
                  request.targetDir,

              logger:
                  request.logger,

              signal:
                  request.signal
          }
      )
  }
}