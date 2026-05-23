export interface GenerateProjectPromptResult {
  projectName: string;
  template: string;
}

export interface PromptPort {
  askGenerateProjectData(): Promise<GenerateProjectPromptResult>;
}
