// packages/tooling/src/utils/create-output-preview.ts

// packages/tooling/src/utils/create-output-preview.ts

export function createOutputPreview(stderr: string, stdout = '', maxLength = 2000): string {
  const output = stderr.trim() || stdout.trim();

  return output.slice(0, maxLength);
}
