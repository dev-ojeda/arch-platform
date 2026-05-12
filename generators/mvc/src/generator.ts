// generators/mvc/src/generator.ts

import * as path from 'node:path'

import type {
    Generator
} from '@arch/contracts'

import {
    generateFiles
} from '@arch/core'

import {
    mvcFiles
} from './files.js'

import type {
    MvcInputVariables
} from './types.js'

export function createMvcGenerator(
    options: {
        templateDir: string
    }
): Generator<MvcInputVariables> {

    return {

        name: 'mvc',

        async generate(ctx) {

            if (!ctx.variables.name.trim()) {

                throw new Error(
                    'Module name is required'
                )
            }

            /*
             * Backward compatibility
             */
            const language =
                ctx.stack?.language ??
                'typescript'

            const framework =
                ctx.stack?.framework ??
                'express'

            /*
             * Dynamic template resolution
             */
            const templateDir = path.join(
                options.templateDir,
                language,
                framework
            )

            /*
             * Declarative file definitions
             */
            const files = mvcFiles

            await generateFiles(
                ctx,
                templateDir,
                files
            )
        }
    }
}