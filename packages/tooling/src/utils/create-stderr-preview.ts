// packages/tooling/src/utils/create-stderr-preview.ts

export function createStderrPreview(stderr: string, maxLength = 2000): string {
  return stderr.trim().slice(0, maxLength);
}
