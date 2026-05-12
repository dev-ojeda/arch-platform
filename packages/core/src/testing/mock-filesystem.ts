// packages/core/src/testing/mock-filesystem.ts

import type {
    FileSystemAdapter
} from '@arch/contracts'

export interface MockFileSystem
extends FileSystemAdapter {

    files: Map<string, string>
}

export function createMockFileSystem():
    MockFileSystem {

    const files =
        new Map<string, string>()

    return {

        files,

        async read(
            filePath: string
        ): Promise<string> {

            const content =
                files.get(filePath)

            if (!content) {

                throw new Error(
                    `File not found: ${filePath}`
                )
            }

            return content
        },

        async write(
            filePath: string,
            content: string
        ): Promise<void> {

            files.set(
                filePath,
                content
            )
        }
    }
}