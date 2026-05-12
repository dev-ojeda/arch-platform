// packages/core/src/prompts/__tests__/prompt-engine.test.ts

import {
    describe,
    expect,
    it
} from 'vitest'

import {
    PromptEngine
} from '../prompt-engine.js'

import {
    createMockPromptAdapter
} from '../../testing/mock-prompt-adapter.js'

describe(
    'PromptEngine',
    () => {

        it(
            'should collect string values',
            async () => {

                const engine =
                    new PromptEngine(
                        createMockPromptAdapter({
                            input: 'users'
                        })
                    )

                const values =
                    await engine.collect({

                        id: 'test',

                        title: 'Test',

                        version: '1.0.0',

                        fields: [
                            {
                                type: 'string',

                                name: 'name',

                                message: 'Module name',

                                required: true
                            }
                        ]
                    })

                expect(values)
                    .toEqual({
                        name: 'users'
                    })
            }
        )

        it(
            'should use default value',
            async () => {

                const engine =
                    new PromptEngine(
                        createMockPromptAdapter({
                            input: ''
                        })
                    )

                const values =
                    await engine.collect({

                        id: 'test',

                        title: 'Test',

                        version: '1.0.0',

                        fields: [
                            {
                                type: 'string',

                                name: 'name',

                                message: 'Module name',

                                defaultValue: 'default-module'
                            }
                        ]
                    })

                expect(values)
                    .toEqual({
                        name: 'default-module'
                    })
            }
        )

        it(
            'should collect select values',
            async () => {

                const engine =
                    new PromptEngine(
                        createMockPromptAdapter({
                            select: 'typescript'
                        })
                    )

                const values =
                    await engine.collect({

                        id: 'test',

                        title: 'Test',

                        version: '1.0.0',

                        fields: [
                            {
                                type: 'select',

                                name: 'language',

                                message: 'Language',

                                options: [
                                    {
                                        label: 'TypeScript',

                                        value: 'typescript'
                                    }
                                ]
                            }
                        ]
                    })

                expect(values)
                    .toEqual({
                        language: 'typescript'
                    })
            }
        )

        it(
            'should collect boolean values',
            async () => {

                const engine =
                    new PromptEngine(
                        createMockPromptAdapter({
                            boolean: true
                        })
                    )

                const values =
                    await engine.collect({

                        id: 'test',

                        title: 'Test',

                        version: '1.0.0',

                        fields: [
                            {
                                type: 'boolean',

                                name: 'auth',

                                message: 'Enable auth'
                            }
                        ]
                    })

                expect(values)
                    .toEqual({
                        auth: true
                    })
            }
        )

        it(
            'should throw when required value is empty',
            async () => {

                const engine =
                    new PromptEngine(
                        createMockPromptAdapter({
                            input: ''
                        })
                    )

                await expect(

                    engine.collect({

                        id: 'test',

                        title: 'Test',

                        version: '1.0.0',

                        fields: [
                            {
                                type: 'string',

                                name: 'name',

                                message: 'Module name',

                                required: true
                            }
                        ]
                    })

                ).rejects.toThrowError()
            }
        )
    }
)