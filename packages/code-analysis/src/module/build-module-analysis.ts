// packages/code-analysis/src/module/build-module-analysis.ts

import type { SourceReader } from '../language/index.js';
import type { PackageResolver } from '../package/index.js';

import { buildModuleDescriptor } from './build-module.js';
import type { ModuleDescriptor } from './model/module-descriptor.js';

export function buildModuleAnalysis(
  source: SourceReader,
  packageResolver: PackageResolver,
): readonly ModuleDescriptor[] {
  return source
    .getSources()
    .map((sourceFile) => buildModuleDescriptor(sourceFile, packageResolver));
}
