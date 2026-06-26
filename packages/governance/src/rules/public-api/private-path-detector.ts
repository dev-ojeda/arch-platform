// packages/governance/src/rules/public-api/private-path-detector.ts

export class PrivatePathDetector {
  isPrivate(importedPath: string, boundaries?: string[]): boolean {
    return boundaries?.some((boundary) => importedPath.includes(`/${boundary}/`)) ?? false;
  }
}
