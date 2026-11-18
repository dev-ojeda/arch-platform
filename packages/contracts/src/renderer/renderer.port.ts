// packages\contracts\src\renderer\renderer.port.ts

export interface RenderTemplateInput {
  template: string;
  output: string;
  variables: Record<string, unknown>;
}

export interface RenderedFile {
  path: string;
  content: string;
}

export interface TemplateRendererPort {
  /**
   * Renders the supplied templates.
   *
   * Results preserve the same order as the input files.
   */
  render(files: RenderTemplateInput[]): Promise<RenderedFile[]>;
}
