// packages\core\src\filesystem\node-fs-adapter.ts
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import type { FileSystemAdapter, OverwritePolicy } from '@arch/contracts'

export class NodeFileSystemAdapter
    implements FileSystemAdapter {
    async write(filePath: string, content: string): Promise<void> {
        await fs.mkdir(
            path.dirname(filePath),
            { recursive: true }
        )

        await fs.writeFile(
            filePath,
            content,
            {
                encoding: 'utf-8',
                flag: 'wx'
            }
        )
    }

    async read(filePath: string): Promise<string> {
        return fs.readFile(filePath, 'utf-8')
    }

    
}