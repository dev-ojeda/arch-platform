// packages/infrastructure/src/rendering/template-renderer.ts

import type { RenderedFile, RenderTemplateInput, TemplateRendererPort } from '@arch/contracts';
import type { FileSystemPort } from '@arch/contracts/filesystem';

import { renderTemplate } from '../templates/handlebars-template-engine.js';

import { loadTemplate } from './template-loader.js';

export class TemplateRenderer implements TemplateRendererPort {
  constructor(
    private readonly fs: FileSystemPort,
    private readonly templateRoot: string,
  ) {}

  async render(files: RenderTemplateInput[]): Promise<RenderedFile[]> {
    const renderedFiles: RenderedFile[] = [];

    for (const file of files) {
      const template = await loadTemplate(this.fs, this.templateRoot, file.template);

      renderedFiles.push({
        path: file.path,
        content: renderTemplate(template, file.variables),
      });
    }

    return renderedFiles;
  }
}
