// packages/governance/src/rules/architecture/architecture-source-detector.ts

export class ArchitectureSourceDetector {
  isPublicBarrel(path: string): boolean {
    const normalized = path.replaceAll('\\', '/');

    return normalized.endsWith('/src/public/index.ts');
  }

  isPackageEntrypoint(path: string): boolean {
    return /[\\/]src[\\/]index\.ts$/.test(path);
  }
  isPrivateSource(path: string): boolean {
    return /\/src\/internal(?:\/|$)/.test(path?.replaceAll('\\', '/') ?? '');
  }
}
