// packages\infrastructure\src\rendering\template-loader.ts

import type { FileSystemAsyncPort } from '@arch/contracts';

import { EmptyTemplateError } from '../errors/template-not-found.error.js';
import { joinPath } from '../filesystem/index.js';

export async function loadTemplate(
  fs: FileSystemAsyncPort,

  templateDir: string,

  templateName: string,
): Promise<string> {
  const templatePath = joinPath(templateDir, templateName);

  const template = await fs.read(templatePath);

  if (!template.trim()) {
    throw new EmptyTemplateError(`Template is empty: ${templatePath}`);
  }

  return template;
}
