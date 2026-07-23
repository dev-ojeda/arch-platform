// packages/infrastructure/src/filesystem/paths/format-path-for-message.ts

export function formatPathForMessage(path: string): string {
  return path.replaceAll('\\', '/').replace(/^[A-Za-z]:/, '');
}
