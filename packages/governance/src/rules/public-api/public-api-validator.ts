// packages/governance/src/rules/public-api/public-api-validator.ts

import type { ResolvedPackage } from '../../types/governance-context.js';

import { ExportMapReader } from './export-map-reader.js';
import { PrivatePathDetector } from './private-path-detector.js';

export class PublicApiValidator {
  private readonly exports = new ExportMapReader();

  private readonly privatePaths = new PrivatePathDetector();

  validateImport(importer: ResolvedPackage, target: ResolvedPackage, importPath: string): boolean {
    if (importer.name === target.name) {
      return true;
    }

    if (this.privatePaths.isPrivate(importPath, target.boundaries?.private)) {
      return false;
    }

    return this.exports.isExported(target.name, importPath, target.manifest);
  }
}
