// packages\infrastructure\src\rendering\template-loader.ts
import { join } from 'node:path';

import type { FileSystemPort } from '@arch/contracts';
import { InvalidGeneratorDefinitionError } from '@arch/core';

export async function loadTemplate(
  fs: FileSystemPort,

  templateDir: string,

  templateName: string,
): Promise<string> {
  const templatePath = join(templateDir, templateName);

  const template = await fs.read(templatePath);

  if (!template.trim()) {
    throw new InvalidGeneratorDefinitionError(`Template is empty: ${templatePath}`);
  }

  return template;
}
