// packages/governance/src/rules/public-api/internal-source-detector.ts

export class InternalSourceDetector {
  isInternalSource(path?: string): boolean {
    return /\/src\/internal(?:\/|$)/.test(path?.replaceAll('\\', '/') ?? '');
  }
}
