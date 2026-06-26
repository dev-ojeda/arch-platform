// packages/governance/src/rules/public-api/export-map-reader.ts

import type { PackageManifest } from '../../types/governance-context.js';

export class ExportMapReader {
  isExported(importPath: string, manifest: PackageManifest): boolean {
    if (!manifest.exports) {
      return importPath === manifest.name;
    }

    return Object.keys(manifest.exports).includes(importPath);
  }
}
