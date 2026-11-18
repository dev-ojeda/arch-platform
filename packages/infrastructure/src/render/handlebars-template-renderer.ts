// packages\infrastructure\src\render\handlebars-template-renderer.ts

import Handlebars from 'handlebars';

import type {
  FileSystemAsyncPort,
  RenderedFile,
  RenderTemplateInput,
  TemplateRendererPort,
} from '@arch-platform/contracts';

export class HandlebarsTemplateRenderer implements TemplateRendererPort {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async render(files: RenderTemplateInput[]): Promise<RenderedFile[]> {
    return Promise.all(
      files.map(async (file) => {
        const source = await this.filesystem.read(file.template);

        const template = Handlebars.compile(source, {
          noEscape: true,
        });

        const output = Handlebars.compile(file.output, {
          noEscape: true,
        });

        return {
          path: output(file.variables),
          content: template(file.variables),
        };
      }),
    );
  }
}
