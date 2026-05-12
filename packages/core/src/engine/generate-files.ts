// packages/core/engine/generate-files.ts

import * as path from 'node:path'

import type {
    FileDefinition,
    GenerationContext
} from '@arch/contracts'

import type {
    NamedVariables
} from '@arch/contracts'

import {
    renderTemplate
} from '../templates/template-engine.js'

import {
    buildVariables
} from '../variables/build-variables.js'

import type {
    ResolvedTemplateVariables
} from '../variables/types.js'

import { GenerationCancelledError, TemplateNotFoundError } from '../errors/generation-errors.js'
import { resolveOutputPath } from './output/output-path.js'
import { runAfterWriteHook, runBeforeWriteHook } from './generation-hooks.js'


export async function generateFiles<
    TVariables extends NamedVariables
>(
    ctx: GenerationContext<TVariables>,

    templateDir: string,

    files: FileDefinition<
        ResolvedTemplateVariables<TVariables>
    >[]
): Promise<void> {

    /*
     * Build derived variables
     */
    const variables =
        buildVariables(ctx)

    for (const file of files) {

        if (ctx.signal?.aborted) {
            throw new GenerationCancelledError()
        }

        /*
         * Conditional generation
         */
        if (
            file.condition &&
            !file.condition(variables)
        ) {

            // ctx.logger.debug?.(
            //     `[arch] skipped ${file.template}`
            // )

            continue
        }

        const templatePath = path.join(
            templateDir,
            file.template
        )

        // ctx.logger.debug?.(
        //     `[arch] template ${templatePath}`
        // )

        const template =
            await ctx.fs.read(templatePath)

        if (!template.trim()) {
            throw new TemplateNotFoundError(
                `Template is empty: ${templatePath}`
            )
        }

        /*
         * Render content
         */
        const renderedContent =
            renderTemplate(
                template,
                variables
            )

        /*
         * Render output path
         */
        const relativeOutputPath =
            renderTemplate(
                file.output,
                variables
            )

        /*
         * Sanitize relative paths
         */
        const sanitizedRelativePath =
            relativeOutputPath.replace(
                /^([/\\\\]+)/,
                ''
            )

        const outputPath =
            resolveOutputPath(
                ctx.targetDir,
                relativeOutputPath
            )

        /*
         * Optional transform hook
         */
        const finalContent =
            file.transform
                ? await file.transform(
                    renderedContent,
                    variables
                )
                : renderedContent

        /*
         * beforeWrite hook
         */
        await runBeforeWriteHook(
            file,
            {
                outputPath,
        
                content: finalContent,
        
                variables
            }
        )

        /*
         * Write file
         */
        await ctx.fs.write(
            outputPath,
            finalContent,
            {
                overwrite: file.overwrite
            }
        )

        /*
         * afterWrite hook
         */
        await runAfterWriteHook(
            file,
            {
                outputPath,
        
                content: finalContent,
        
                variables
            }
        )

        ctx.logger.info(
            `[arch] created ${relativeOutputPath}`
        )
    }
}