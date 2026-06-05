// packages\infrastructure\src\rendering\template-loader.ts
import * as path from 'node:path';

import type { FileSystemPort } from '@arch/contracts/filesystem';
import { InvalidGeneratorDefinitionError } from '@arch/core/errors';

export async function loadTemplate(
  fs: FileSystemPort,

  templateDir: string,

  templateName: string,
): Promise<string> {
  const templatePath = path.join(templateDir, templateName);

  const template = await fs.read(templatePath);

  if (!template.trim()) {
    throw new InvalidGeneratorDefinitionError(`Template is empty: ${templatePath}`);
  }

  return template;
}
