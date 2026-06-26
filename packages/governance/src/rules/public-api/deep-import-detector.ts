// packages/governance/src/rules/public-api/deep-import-detector.ts

export class DeepImportDetector {
  isDeepImport(packageName: string, importPath: string): boolean {
    return importPath.startsWith(`${packageName}/`);
  }
}
