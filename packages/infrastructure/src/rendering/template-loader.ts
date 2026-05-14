// packages\core\src\generation\template-loader.ts
import * as path from 'node:path'

import type {
    FileSystemAdapter
} from '@arch/contracts'
import { EmptyTemplateError } from '@arch/core'

export async function loadTemplate(

    fs: FileSystemAdapter,

    templateDir: string,

    templateName: string
): Promise<string> {

    const templatePath = path.join(
        templateDir,
        templateName
    )

    const template =
        await fs.read(templatePath)

    if (!template.trim()) {

        throw new EmptyTemplateError(
            `Template is empty: ${templatePath}`
        )
    }

    return template
}