// packages/governance/src/rules/public-api/export-map-reader.ts

import type { PackageManifest } from '@arch/platform-model';

export class ExportMapReader {
  isExported(packageName: string, importPath: string, manifest: PackageManifest): boolean {
    if (!manifest.exports) {
      return importPath === packageName;
    }

    const exportKey = this.toExportKey(packageName, importPath);

    return Object.keys(manifest.exports).some((key) => key === exportKey);
  }

  private toExportKey(packageName: string, importPath: string): string {
    if (importPath === packageName) {
      return '.';
    }

    if (!importPath.startsWith(`${packageName}/`)) {
      return importPath;
    }

    return `.${importPath.slice(packageName.length)}`;
  }
}
