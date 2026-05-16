// packages\application\src\application\pipeline\file-writer.ts

import type {
  FileSystemPort
} from '@arch/contracts'

import type {
  GeneratedFile
} from './artifacts/generated-file.js'

export async function writeGeneratedFiles(
  fs: FileSystemPort,

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