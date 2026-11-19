// packages/application/src/generation/steps/render-files.step.ts

import type {
  GeneratedFile,
  GenerationContext,
  GenerationPipelineStep,
  TemplateRendererPort,
  TemplateVariables,
} from '@arch-platform/contracts';

export class RenderFilesStep<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'render-files';

  constructor(private readonly renderer: TemplateRendererPort) {}

  async execute(context: GenerationContext<TVariables>): Promise<void> {
    const variables = context.resolvedVariables;

    if (!variables) {
      throw new Error('Resolved variables not available');
    }

    const templates = context.resolvedTemplates;

    if (!templates) {
      throw new Error('Resolved templates not available');
    }

    const renderedFiles = await this.renderer.render(
      templates.map(({ template }) => ({
        template: template.template,
        output: template.output,
        variables,
      })),
    );

    if (renderedFiles.length !== templates.length) {
      throw new Error(
        `Expected ${templates.length} rendered files, received ${renderedFiles.length}`,
      );
    }

    const generatedFiles: GeneratedFile[] = renderedFiles.map((renderedFile, index) => {
      if (!renderedFile.path?.trim()) {
        throw new Error(`Renderer returned an empty output path for template at index ${index}`);
      }

      return {
        path: renderedFile.path,
        content: renderedFile.content,
        overwrite: templates[index]?.template.overwrite,
      };
    });

    context.files.push(...generatedFiles);
  }
}
