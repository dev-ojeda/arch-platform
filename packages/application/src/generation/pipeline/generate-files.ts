// packages\application\src\pipeline\generate-files.ts
import * as path from 'node:path'

import type {
  FileDefinition,
  GenerationContext,
  LanguageConvention,
  NamedVariables,
  ResolvedTemplateVariables
} from '@arch/contracts'

import {
  buildVariables,
  GenerationCancelledError,
  resolveOutputPath,
  runAfterWriteHook,
  runBeforeWriteHook,
  InvalidGeneratorDefinitionError
} from '@arch/core'

import {
  writeGeneratedFiles
} from './file-writer.js'
import type { GeneratedFile } from './artifacts/generated-file.js'
import { renderTemplate } from '../../templates/template-engine.js'
export interface GenerateFilesOptions {

  language:
  LanguageConvention
}
export async function generateFiles<
  TVariables extends NamedVariables
>(
  ctx: GenerationContext<TVariables>,

  templateDir: string,

  files: readonly FileDefinition<
    ResolvedTemplateVariables<TVariables>
  >[],

  options: GenerateFilesOptions
): Promise<void> {

  const variables =
    buildVariables(
      ctx,
      options.language
    )

  const generatedFiles:
    GeneratedFile[] = []

  for (const file of files) {

    assertNotCancelled(ctx)

    const shouldGenerate =
      await shouldGenerateFile(
        file,
        variables
      )

    if (!shouldGenerate) {
      continue
    }

    const templatePath =
      resolveTemplatePath(
        templateDir,
        file.template
      )

    const template =
      await loadTemplate(
        ctx,
        templatePath
      )

    const renderedContent =
      await renderFileContent(
        file,
        template,
        variables
      )

    const relativeOutputPath =
      renderOutputPath(
        file,
        variables
      )

    const outputPath =
      resolveOutputPath(
        ctx.targetDir,
        relativeOutputPath
      )

    const hookContext = {

      outputPath,

      content:
        renderedContent,

      variables
    }

    await runBeforeWriteHook(
      file,
      hookContext
    )

    generatedFiles.push({

      path:
        outputPath,

      content:
        renderedContent,

      overwrite:
        file.overwrite
    })

    await runAfterWriteHook(
      file,
      hookContext
    )

    ctx.logger.info(
      `[arch] created ${relativeOutputPath}`
    )
  }

  await writeGeneratedFiles(
    ctx.fs,
    generatedFiles
  )
}

function assertNotCancelled<TVariables extends NamedVariables>(
  ctx: GenerationContext<TVariables>
): void {

  if (!ctx.signal?.aborted) {
    return
  }

  throw new GenerationCancelledError()
}

async function shouldGenerateFile<
  TVariables extends NamedVariables
>(
  file: FileDefinition<TVariables>,

  variables: TVariables
): Promise<boolean> {

  if (!file.condition) {
    return true
  }

  return await file.condition(
    variables
  )
}

function resolveTemplatePath(
  templateDir: string,

  template: string
): string {

  return path.join(
    templateDir,
    template
  )
}

async function loadTemplate<TVariables extends NamedVariables>(
  ctx: GenerationContext<TVariables>,

  templatePath: string
): Promise<string> {

  const template =
    await ctx.fs.read(
      templatePath
    )

  if (template.trim()) {
    return template
  }

  throw new InvalidGeneratorDefinitionError(
    templatePath
  )
}

async function renderFileContent<
  TVariables extends NamedVariables
>(
  file: FileDefinition<TVariables>,

  template: string,

  variables: TVariables
): Promise<string> {

  const rendered =
    renderTemplate(
      template,
      variables
    )

  if (!file.transform) {
    return rendered
  }

  return await file.transform(
    rendered,
    variables
  )
}

function renderOutputPath<
  TVariables extends NamedVariables
>(
  file: FileDefinition<TVariables>,

  variables: TVariables
): string {

  const rendered =
    renderTemplate(
      file.output,
      variables
    )

  return rendered.replace(
    /^([/\\\\]+)/,
    ''
  )
}