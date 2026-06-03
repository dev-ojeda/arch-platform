// packages/tooling/src/utils/create-command-output-preview.ts

export function createCommandOutputPreview(
  result: {
    stdout?: string;
    stderr?: string;
  },
  maxLength = 2000,
): string {
  const stderr = result.stderr?.trim() ?? '';

  const stdout = result.stdout?.trim() ?? '';

  const output = stderr.length > 0 ? stderr : stdout;

  return output.slice(0, maxLength);
}
