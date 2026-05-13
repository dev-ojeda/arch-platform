import type { TemplateRegistryPort, NotificationPort, FileSystemPort } from "../../ports/index.js";
import type { PromptPort } from "../../ports/prompt/index.js";
import type { TemplateRendererPort } from "../../ports/renderer/renderer.port.js";

export class GenerateProjectUseCase {
  constructor(
    private readonly prompts: PromptPort,
    private readonly templates: TemplateRegistryPort,
    private readonly renderer: TemplateRendererPort,
    private readonly filesystem: FileSystemPort,
    private readonly notifications: NotificationPort,
  ) {}

  async execute(): Promise<void> {
    const config =
      await this.prompts.askGenerateProjectData();

    const template =
      await this.templates.get(config.template);

    const renderedFiles =
      await this.renderer.render(
        template.files.map((file) => ({
          template: file.content,
          variables: {
            projectName: config.projectName,
          },
        })),
      );

    await this.filesystem.writeFiles(
      renderedFiles,
      config.projectName,
    );

    await this.notifications.info(
      "Project generated successfully",
    );
  }
}