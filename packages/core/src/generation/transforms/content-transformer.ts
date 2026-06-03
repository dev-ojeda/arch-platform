import type { FileDefinition } from '@arch/contracts/templates';
import type { NamedVariables } from '@arch/contracts/variables';

export async function transformContent<TVariables extends NamedVariables>(
  file: FileDefinition<TVariables>,

  content: string,

  variables: TVariables,
): Promise<string> {
  if (!file.transform) {
    return content;
  }

  return file.transform(content, variables);
}
