// packages/code-analysis/src/symbol-graph/package-name-resolver.ts

export function resolvePackageName(filePath: string): string | undefined {
  const normalized = filePath.replace(/\\/g, '/');

  const match = normalized.match(/\/?packages\/([^/]+)/);

  if (!match) {
    return undefined;
  }

  return `@arch/${match[1]}`;
}
