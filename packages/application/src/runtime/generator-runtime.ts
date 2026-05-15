// packages\application\src\application\runtime\generator-runtime.ts
import * as path from 'node:path'

import type {
    FileSystemPort,
    GenerationContext,
    GeneratorDefinition,
    LoggerPort,
    NamedVariables,
    TechnologyStack
} from '@arch/contracts'

import {
    PromptEngine,
    type PromptAdapter
} from '../orchestration/prompt-engine.js'

import {
    generateFiles
} from '../pipeline/generate-files.js'
import { consoleLogger, type LanguageConventionRegistry } from '@arch/core'

export interface GeneratorRuntimeOptions {

    promptAdapter: PromptAdapter

    templateRoot: string

    languageRegistry:
    LanguageConventionRegistry

    defaultFs?:
    FileSystemPort
}

export interface GeneratorExecutionContext {

    targetDir: string

    fs?: FileSystemPort

    logger?: LoggerPort

    signal?: AbortSignal
}

export class GeneratorRuntime {

    readonly #promptEngine:
        PromptEngine

    constructor(
        private readonly options:
            GeneratorRuntimeOptions
    ) {

        this.#promptEngine =
            new PromptEngine(
                options.promptAdapter
            )
    }

    async execute<
        TVariables extends NamedVariables
    >(
        generator:
            GeneratorDefinition<TVariables>,

        ctx:
            GeneratorExecutionContext
    ): Promise<void> {

        const variables =
            await this.collectVariables(
                generator,
                ctx
            )

        const stack =
            this.resolveStack(
                generator
            )

        const templateDir =
            this.resolveTemplateDirectory(
                generator,
                stack
            )

        const language =
            this.options.languageRegistry.get(
                stack.languageId
            )

        const generationContext =
            this.createGenerationContext(
                ctx,
                variables,
                stack
            )

        await generateFiles(

            generationContext,

            templateDir,

            generator.templates,

            {
                language
            }
        )
    }

    private async collectVariables<
        TVariables extends NamedVariables
    >(
        generator:
            GeneratorDefinition<TVariables>,

        ctx:
            GeneratorExecutionContext
    ): Promise<TVariables> {

        return await this.#promptEngine.collect(
            generator.schema,
            {
                signal:
                    ctx.signal
            }
        )
    }

    private resolveStack<TVariables extends NamedVariables>(
        generator: GeneratorDefinition<TVariables>
    ): TechnologyStack {

        return {

            id:
                generator.descriptor.id,

            languageId:
                generator.descriptor
                    .languages?.[0]
                ?? 'typescript',

            frameworkId:
                generator.descriptor
                    .frameworks?.[0]
                ?? 'default'
        }
    }

    private resolveTemplateDirectory<TVariables extends NamedVariables>(
        generator: GeneratorDefinition<TVariables>,

        stack: TechnologyStack
    ): string {

        return path.join(

            this.options.templateRoot,

            generator.descriptor.id,

            stack.languageId,

            stack.frameworkId
            ?? 'default'
        )
    }

    private createGenerationContext<
        TVariables extends NamedVariables
    >(
        ctx:
            GeneratorExecutionContext,

        variables:
            TVariables,

        stack:
            TechnologyStack
    ):
        GenerationContext<TVariables> {

        const fs =
            ctx.fs ??
            this.options.defaultFs

        if (!fs) {

            throw new Error(
                'FileSystemPort not configured'
            )
        }

        return {

            targetDir:
                ctx.targetDir,

            fs,

            logger:
                ctx.logger ??
                consoleLogger,

            signal:
                ctx.signal,

            stack,

            variables
        }
    }
}