// packages/governance/src/rules/public-api/private-path-detector.ts

export class PrivatePathDetector {
  async isPrivate(importedPath: string, boundaries?: string[]): Promise<boolean> {
    return Promise.resolve(
      boundaries?.some((boundary) => importedPath.includes(boundary)) ?? false,
    );
  }
}
