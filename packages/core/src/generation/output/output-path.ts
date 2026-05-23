// packages\core\src\output\output-path.ts

import * as path from 'node:path';

import { InvalidGeneratorDefinitionError } from '../../errors/validation/invalid-generator-definition.error.js';

export function sanitizeRelativePath(outputPath: string): string {
  return outputPath.replace(/^([/\\\\]+)/, '');
}

export function ensureSafeOutputPath(
  targetDir: string,
  outputPath: string,
  relativeOutputPath: string,
): void {
  const normalizedTargetDir = path.normalize(targetDir);

  const normalizedOutputPath = path.normalize(outputPath);

  const relative = path.relative(normalizedTargetDir, normalizedOutputPath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new InvalidGeneratorDefinitionError(`Invalid output path: ${relativeOutputPath}`);
  }
}

export function resolveOutputPath(targetDir: string, relativeOutputPath: string): string {
  const sanitizedRelativePath = sanitizeRelativePath(relativeOutputPath);

  const outputPath = path.join(targetDir, sanitizedRelativePath);

  ensureSafeOutputPath(targetDir, outputPath, relativeOutputPath);

  return outputPath;
}
