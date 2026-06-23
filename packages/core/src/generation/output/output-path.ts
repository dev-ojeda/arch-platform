// packages\core\src\generation\output\output-path.ts

import type { PathService } from '@arch/contracts';

import { InvalidGeneratorDefinitionError } from '../../errors/validation/invalid-generator-definition.error.js';

export function sanitizeRelativePath(outputPath: string): string {
  return outputPath.replace(/^([/\\\\]+)/, '');
}

export function ensureSafeOutputPath(
  pathService: PathService,
  targetDir: string,
  outputPath: string,
  relativeOutputPath: string,
): void {
  const normalizedTargetDir = pathService.normalize(targetDir);

  const normalizedOutputPath = pathService.normalize(outputPath);

  const relative = pathService.relative(normalizedTargetDir, normalizedOutputPath);

  if (relative.startsWith('..') || pathService.isAbsolute(relative)) {
    throw new InvalidGeneratorDefinitionError(`Invalid output path: ${relativeOutputPath}`);
  }
}

export function resolveOutputPath(
  pathService: PathService,
  targetDir: string,
  relativeOutputPath: string,
): string {
  const sanitizedRelativePath = sanitizeRelativePath(relativeOutputPath);

  const outputPath = pathService.join(targetDir, sanitizedRelativePath);

  ensureSafeOutputPath(pathService, targetDir, outputPath, relativeOutputPath);

  return outputPath;
}
