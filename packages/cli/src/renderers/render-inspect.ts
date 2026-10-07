// packages/cli/src/renderers/render-inspect.ts

import type { InspectResult } from '@arch-platform/application';

import { terminal } from '../ui/terminal.js';

export function renderInspectResult(result: InspectResult): void {
  renderHeader(result);

  renderArtifact(result);
  renderIntegrity(result);

  renderFooter(result);
}

function renderHeader(result: InspectResult): void {
  terminal.info('');
  terminal.info('ARCH Inspect');
  terminal.info('──────────────────────────────────────────────');
  terminal.info(`Artifact: ${result.artifact}`);
  terminal.info('');
}

function renderArtifact(result: InspectResult): void {
  terminal.info(`File: ${result.inspection.file}`);
  terminal.info(`Size: ${result.inspection.size} bytes`);
  terminal.info('');

  terminal.info('Package:');
  terminal.info(`  Status:  ${result.inspection.artifactRegistryStatus}`);
  terminal.info(`  Name:    ${result.inspection.package.name}`);
  terminal.info(`  Version: ${result.inspection.package.version}`);
  terminal.info(`  Files:   ${result.inspection.package.filesInside.length}`);
  terminal.info('');
}

function renderIntegrity(result: InspectResult): void {
  const { integrity } = result.inspection;

  terminal.info('Integrity:');
  terminal.info(`  Calculated: ${integrity.calculated}`);

  if (integrity.expected) {
    terminal.info(`  Expected:   ${integrity.expected}`);
  } else {
    terminal.info('  Expected:   <not available>');
  }

  if (integrity.matches === true) {
    terminal.success('  ✅ Matches:  YES');
  } else if (integrity.matches === false) {
    terminal.error('  ❌ Matches:  NO');
  } else {
    terminal.info('  Matches:    <not evaluated>');
  }

  terminal.info('');
}

function renderFooter(result: InspectResult): void {
  terminal.info(`Duration: ${result.durationMs}ms`);
}
