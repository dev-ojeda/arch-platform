// packages/governance/src/rules/public-api/export-map-reader.ts

import type { PackageManifest } from '@arch/platform-model';

export class ExportMapReader {
  isExported(packageName: string, importPath: string, manifest: PackageManifest): boolean {
    if (!manifest.exports) {
      return importPath === packageName;
    }

    const exportKey = importPath === packageName ? '.' : importPath.replace(`${packageName}`, '.');

    return Object.keys(manifest.exports).some((key) => key === exportKey);
  }
}
