// packages/cli/src/renderers/render-version.ts

import type { VersionResult } from '@arch-platform/application';

import { terminal } from '../ui/terminal.js';

export function renderVersionResult(result: VersionResult): void {
  renderHeader(result);

  renderVersion(result);

  renderFooter(result);
}

function renderHeader(result: VersionResult): void {
  terminal.info('');
  terminal.info('ARCH Version');
  terminal.info('──────────────────────────────────────────────');
  terminal.info(`Artifact: ${result.artifact}`);
  terminal.info('');
}

function renderVersion(result: VersionResult): void {
  terminal.info(`Release Type:    ${result.releaseType ?? 'not evaluated'}`);
  terminal.info(`Current Version: ${result.currentVersion}`);
  terminal.info(`Next Version:    ${result.nextVersion}`);
  terminal.info('');
}

function renderFooter(result: VersionResult): void {
  terminal.info(`Duration: ${result.durationMs}ms`);
}
