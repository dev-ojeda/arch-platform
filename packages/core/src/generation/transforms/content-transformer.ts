import type { FileDefinition, NamedVariables } from '@arch-platform/contracts';

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
