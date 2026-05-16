// packages\application\src\pipeline\__tests__\generate-files.test.ts

import { createMemoryFilesystem, createTestContext, testLanguageConvention } from '@arch/testing'
import {
  describe,
  expect,
  it
} from 'vitest'
import { generateFiles } from '../generate-files.js'

describe(
  'generateFiles',
  () => {

    it(
      'generates a single file',
      async () => {

        const fs =
          createMemoryFilesystem()

        await fs.write(
          '/templates/service.hbs',
          'export class {{name}}Service {}'
        )

        const ctx =
          createTestContext({
            fs
          })

        await generateFiles(
          ctx,
          '/templates',
          [
            {
              template:
                'service.hbs',

              output:
                '{{name}}.service.ts'
            }
          ],
          {
            language:
              testLanguageConvention
          }
        )

        expect(
          fs.getFiles()
        )
          .toMatchSnapshot()
      }
    )
  }
)


