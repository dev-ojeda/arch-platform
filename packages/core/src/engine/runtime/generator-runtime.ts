// packages/core/src/runtime/generator-runtime.ts

import * as path from 'node:path'




import { NodeFileSystemAdapter } from '../filesystem/node-fs-adapter.js'
import { consoleLogger } from '../../logging/console-logger.js'
import { generateFiles } from '../generate-files.js'
import { PromptEngine, type PromptAdapter } from '../../prompts/prompt-engine.js'
import type { FileSystemAdapter, GenerationContext, GeneratorDefinition, NamedVariables, Logger } from '@arch/contracts'

export interface GeneratorRuntimeOptions {

    promptAdapter: PromptAdapter

    templateRoot: string
}

export class GeneratorRuntime {

    private readonly promptEngine: PromptEngine

    constructor(
        private readonly options:
            GeneratorRuntimeOptions
    ) {

        this.promptEngine =
            new PromptEngine(
                options.promptAdapter
            )
    }

    async execute<
        TVariables extends NamedVariables
    >(
        generator: GeneratorDefinition<TVariables>,

        ctx: {

            targetDir: string

            fs?: FileSystemAdapter

            logger?: Logger

            signal?: AbortSignal
        }
    ): Promise<void> {

        /*
         * Collect prompt values
         */
        const values =
            await this.promptEngine.collect(
                generator.schema
            ) as TVariables

        /*
         * Resolve capabilities
         */
        const language =
            generator.capabilities
                ?.languages?.[0]
            ?? 'typescript'

        const framework =
            generator.capabilities
                ?.frameworks?.[0]
            ?? 'default'

        /*
         * Resolve template directory
         */
        const templateDir = path.join(

            this.options.templateRoot,

            generator.id,

            language ?? 'typescript',

            framework ?? 'default'
        )

        /*
         * Execute generation pipeline
         */
        const generationContext:
            GenerationContext<TVariables> = {

            targetDir:
                ctx.targetDir,

            fs:
                ctx.fs ??
                new NodeFileSystemAdapter(),

            logger:
                ctx.logger ??
                consoleLogger,

            signal:
                ctx.signal,

            stack: {

                pattern:
                    generator.id,

                language,

                framework
            },

            variables: values
        }

        await generateFiles(

            generationContext,

            templateDir,

            generator.templates
        )
    }
}