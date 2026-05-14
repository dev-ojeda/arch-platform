// packages/core/src/generators/__tests__/generate-files.test.ts

import {
    describe,
    expect,
    it
} from 'vitest'

import {
    resolveOutputPath
} from '../../output/output-path.js'

describe(
    'resolveOutputPath',
    () => {

        it(
            'should prevent path traversal',
            () => {

                expect(() =>

                    resolveOutputPath(
                        '/project',
                        '../../evil.txt'
                    )

                ).toThrowError()
            }
        )

        it(
            'should resolve safe paths',
            () => {

                const result =
                    resolveOutputPath(
                        '/project',
                        'src/app.ts'
                    )

                expect(result)
                    .toContain(
                        'src'
                    )
            }
        )
    }
)