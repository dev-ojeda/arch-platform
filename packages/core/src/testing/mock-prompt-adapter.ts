// packages/core/src/testing/mock-prompt-adapter.ts

import { vi } from 'vitest'

import type {
    PromptAdapter
} from '../prompts/prompt-engine.js'

export interface MockPromptValues {

    input?: string

    select?: string

    boolean?: boolean
}

export function createMockPromptAdapter(
    values?: MockPromptValues
): PromptAdapter {

    return {

        input: vi.fn(

            async () =>

                values?.input ??
                'users'
        ),

        select: vi.fn(

            async () =>

                values?.select ??
                'typescript'
        ),

        boolean: vi.fn(

            async () =>

                values?.boolean ??
                true
        )
    }
}