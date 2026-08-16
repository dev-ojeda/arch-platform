// packages/governance/src/rules/public-api/public-api-validator.ts

import type { ExportedSymbolIndex } from '@arch/code-analysis';
import type { Diagnostic } from '@arch/platform-model';

import type { ImportContext } from '../../analysis/imports/import-context.js';

import { ExportMapReader } from './export-map-reader.js';
import { PrivatePathDetector } from './private-path-detector.js';

export class PublicApiValidator {
  constructor(
    private readonly exports = new ExportMapReader(),
    private readonly privatePaths = new PrivatePathDetector(),
  ) {}

  validateImport(
    importContext: ImportContext,
    dependencies?: ExportedSymbolIndex,
  ): Diagnostic | undefined {
    if (importContext.sourcePackage === importContext.targetPackage) {
      return undefined;
    }

    if (importContext.moduleSpecifier) {
      const privateDiagnostic = this.validatePrivateImport(importContext);

      if (privateDiagnostic) {
        return privateDiagnostic;
      }

      const exportDiagnostic = this.validateExportBoundary(importContext);

      if (exportDiagnostic) {
        return exportDiagnostic;
      }
    }

    if (!dependencies) {
      return undefined;
    }

    return this.validatePublicSymbol(importContext, dependencies);
  }

  private validatePrivateImport(context: ImportContext): Diagnostic | undefined {
    const moduleSpecifier = context.moduleSpecifier;

    if (!moduleSpecifier) {
      return undefined;
    }

    if (!this.privatePaths.isPrivate(moduleSpecifier)) {
      return undefined;
    }

    return {
      code: 'ARCH_PRIVATE_API_ACCESS',
      severity: 'error',
      source: 'governance',
      message: `Package ${context.sourcePackage.name} imports private path ${moduleSpecifier} from ${context.target.package}`,
      hint: 'Use the public package API',

      location: {
        file: context.sourceFile,
      },

      metadata: {
        rule: 'OnlyPublicApiRule',
        importer: context.sourcePackage.name,
        imported: context.target.package,
        importPath: moduleSpecifier,
      },
    };
  }
  private validateExportBoundary(context: ImportContext): Diagnostic | undefined {
    if (!context.moduleSpecifier) {
      return undefined;
    }

    if (
      this.exports.isExported(
        context.targetPackage.name,
        context.moduleSpecifier,
        context.targetPackage.manifest,
      )
    ) {
      return undefined;
    }

    return {
      code: 'ARCH_EXPORT_BOUNDARY_VIOLATION',
      severity: 'error',
      source: 'governance',
      message: `Import ${context.moduleSpecifier} is not part of ${context.targetPackage.name} public exports`,
      hint: 'Expose the module through package exports',
      metadata: {
        rule: 'OnlyPublicApiRule',
        importer: context.sourcePackage.name,
        imported: context.target.package,
        importPath: context.moduleSpecifier,
      },
    };
  }
  private validatePublicSymbol(
    context: ImportContext,
    dependencies: ExportedSymbolIndex,
  ): Diagnostic | undefined {
    if (dependencies.isPublicExport(context.targetPackage.name, context.target.name)) {
      return undefined;
    }

    return {
      code: 'ARCH_ONLY_PUBLIC_API',
      severity: 'error',
      source: 'governance',
      message: `Package ${context.sourcePackage.name} imports non-public symbol ${context.target.name} from ${context.target.package}`,
      hint: `Expose ${context.target.name} through the public package API`,
      metadata: {
        rule: 'OnlyPublicApiRule',
        importer: context.sourcePackage.name,
        imported: context.target.package,
      },
    };
  }
}
