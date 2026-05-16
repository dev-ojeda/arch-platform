// packages/application/src/application/use-cases/generate-project/generate-project.use-case.ts

import type {
    GeneratorDefinition,
    LoggerPort,
    NamedVariables
}
from '@arch/contracts'

import {
    GeneratorNotFoundError,

    type GeneratorRegistry
}
from '@arch/core'

import type {
    GeneratorRuntime
}
from '../../generation/runtime/generator-runtime.js'

export interface GenerateProjectRequest {

    readonly generatorId: string

    readonly targetDir: string

    readonly logger?: LoggerPort

    readonly signal?: AbortSignal
}

export class GenerateProjectUseCase {

    constructor(

        private readonly registry:
            GeneratorRegistry,

        private readonly runtime:
            GeneratorRuntime
    ) { }

    async execute(
        request:
            GenerateProjectRequest
    ): Promise<void> {

        const generator =
            this.registry.get(
                request.generatorId
            )

        if (!generator) {

            throw new GeneratorNotFoundError(
                request.generatorId
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