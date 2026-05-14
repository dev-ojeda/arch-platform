// packages\application\src\application\pipeline\file-writer.ts

import type {
  FileSystemAdapter
} from '@arch/contracts'

import type {
  GeneratedFile
} from './generated-file.js'

export async function writeGeneratedFiles(
  fs: FileSystemAdapter,

  files: GeneratedFile[]
): Promise<void> {

  for (const file of files) {

      await fs.write(
          file.path,

          file.content,

          {
              overwrite:
                  file.overwrite
          }
      )
  }
}