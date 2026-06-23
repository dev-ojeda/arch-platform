// packages/application/src/generation/steps/render-files.step.ts

import type {
  GeneratedFile,
  GenerationContext,
  GenerationPipelineStep,
  TemplateRendererPort,
  TemplateVariables,
} from '@arch/contracts';

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
      templates.map((resolvedTemplate) => ({
        template: resolvedTemplate.template.template,
        path: resolvedTemplate.outputPath,
        variables,
      })),
    );

    const generatedFiles: GeneratedFile[] = [];

    for (const [index, resolvedTemplate] of templates.entries()) {
      generatedFiles.push({
        path: resolvedTemplate.outputPath,
        content: renderedFiles[index]?.content ?? '',
      });
    }

    context.files.push(...generatedFiles);
  }
}
