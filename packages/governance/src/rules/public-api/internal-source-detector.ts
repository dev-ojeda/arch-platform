// packages/governance/src/rules/public-api/internal-source-detector.ts

export class InternalSourceDetector {
  isInternalSource(path?: string): boolean {
    const normalized = path?.replaceAll('\\', '/') ?? '';

    return /\/src\/internal(?:\/|$)/.test(normalized) || /\/internal(?:\/|$)/.test(normalized);
  }
}
