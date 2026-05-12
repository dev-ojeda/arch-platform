// packages/core/src/runtime/__tests__/generator-runtime.test.ts

import {
    describe,
    expect,
    it
} from 'vitest'

import {
    GeneratorRuntime
} from '../generator-runtime.js'
import { createMockPromptAdapter } from '../../../testing/mock-prompt-adapter.js'



describe(
    'GeneratorRuntime',
    () => {

        it(
            'should collect prompt values',
            async () => {

                const runtime =
                    new GeneratorRuntime({

                        promptAdapter:
                            createMockPromptAdapter({

                                input:
                                    'users'
                            }),

                        templateRoot:
                            '/templates'
                    })

                expect(runtime)
                    .toBeDefined()
            }
        )
    }
)