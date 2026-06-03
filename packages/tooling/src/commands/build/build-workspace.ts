// packages/tooling/src/commands/build/build-workspace.ts

import { FileConfigNames } from '../config/config-file-name.js';

import { buildBundle } from './build-bundle.js';
import { buildDeclarations } from './build-declarations.js';
import { validateBuildConfiguration } from './validate-build-configuration.js';

export async function buildWorkspace(): Promise<number> {
  const configPath = FileConfigNames.tsupConfig;
  const declarationsConfigPath = FileConfigNames.tsconfigBuild;

  if (!validateBuildConfiguration(configPath, declarationsConfigPath)) {
    return 0;
  }

  const bundleResult = await buildBundle(configPath);

  if (bundleResult.failed) {
    return bundleResult.exitCode;
  }

  const declarationsResult = await buildDeclarations(declarationsConfigPath);

  if (declarationsResult.failed) {
    return declarationsResult.exitCode;
  }

  return 0;
}
