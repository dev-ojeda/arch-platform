// packages/core/src/testing/mock-generator-context.ts

import type {
    GenerationContext,
    NamedVariables
} from '@arch/contracts'

import {
    createMockFileSystem
} from './mock-filesystem.js'

import {
    createMockLogger
} from './mock-logger.js'

export function createMockGenerationContext<
    TVariables extends NamedVariables =
        NamedVariables
>(
    variables?: TVariables
): GenerationContext<TVariables> {

    return {

        targetDir:
            '/project',

        variables:
            (variables ??
                {}) as TVariables,

        fs:
            createMockFileSystem(),

        logger:
            createMockLogger(),

        stack: {

            pattern:
                'mvc',

            language:
                'typescript',

            framework:
                'express'
        }
    }
}