import type { TemplateDefinition } from './template-definition.js';

export interface TemplateManifest {
  id: string;

  name: string;

  description?: string;

  language?: string;

  framework?: string;

  tags?: string[];

  templates: TemplateDefinition[];
}
