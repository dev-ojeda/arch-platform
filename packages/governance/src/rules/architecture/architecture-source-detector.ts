// packages/governance/src/rules/architecture/architecture-source-detector.ts

export class ArchitectureSourceDetector {
  isPublicBarrel(path: string): boolean {
    const normalized = path.replaceAll('\\', '/');

    return normalized.endsWith('/src/public/index.ts');
  }

  // isPrivateSource(path: string): boolean {
  //   const normalized = path.replaceAll('\\', '/');

  //   return normalized.includes('/src/internal/');
  // }
  isPrivateSource(path: string): boolean {
    return /\/src\/internal(?:\/|$)/.test(path?.replaceAll('\\', '/') ?? '');
  }
}
