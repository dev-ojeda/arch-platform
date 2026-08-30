// packages/governance/src/rules/cross-package-relative-import-scanner.ts

import type { Diagnostic } from '@arch/platform-model';

import { ImportContextScanner } from '../analysis/imports/import-context-scanner.js';
import type { GovernanceExecutionContext } from '../context/governance-execution-context.js';

export class CrossPackageRelativeImportScanner {
  constructor(private readonly imports = new ImportContextScanner()) {}

  scan(context: GovernanceExecutionContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    for (const importContext of this.imports.scan(context)) {
      const moduleSpecifier = importContext.moduleSpecifier;

      if (!moduleSpecifier || !this.isRelative(moduleSpecifier)) {
        continue;
      }

      if (importContext.sourcePackage.name === importContext.targetPackage.name) {
        continue;
      }

      diagnostics.push({
        code: 'ARCH_CROSS_PACKAGE_RELATIVE_IMPORT',
        severity: 'error',
        source: 'governance',
        message: `Package ${importContext.sourcePackage.name} uses relative import ${moduleSpecifier} to access ${importContext.targetPackage.name}`,
        hint: 'Use the target package public API instead of a cross-package relative import',
        location: {
          file: importContext.sourceFile,
        },
        metadata: {
          rule: 'CrossPackageRelativeImportRule',
          importer: importContext.sourcePackage.name,
          imported: importContext.targetPackage.name,
          importPath: moduleSpecifier,
        },
      });
    }

    return diagnostics;
  }

  private isRelative(moduleSpecifier: string): boolean {
    return (
      moduleSpecifier === '.' ||
      moduleSpecifier.startsWith('./') ||
      moduleSpecifier.startsWith('../')
    );
  }
}
