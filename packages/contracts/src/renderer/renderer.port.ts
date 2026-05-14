export interface RenderTemplateInput {
  template: string;
  variables: Record<string, unknown>;
}

export interface RenderedFile {
  path: string;
  content: string;
}

export interface TemplateRendererPort {
  render(
    files: RenderTemplateInput[],
  ): Promise<RenderedFile[]>;
}