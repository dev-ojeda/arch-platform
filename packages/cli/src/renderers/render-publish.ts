// packages/cli/src/renderers/render-publish.ts

import type { PublishResult } from '@arch-platform/application';

import { terminal } from '../ui/terminal.js';

export function renderPublishResult(result: PublishResult): void {
  renderHeader(result);

  if (result.success) {
    renderEligible();
  } else {
    renderBlocked(result);
  }

  renderFooter(result);
}

function renderHeader(result: PublishResult): void {
  terminal.info('');
  terminal.info('ARCH Publish');
  terminal.info('──────────────────────────────────────────────');
  terminal.info(`Artifact: ${result.artifact}`);
  terminal.info(`Version: ${result.version}`);
  terminal.info('');
}

function renderEligible(): void {
  terminal.success('✅ Status: ELIGIBLE');
  terminal.info('');
}

function renderBlocked(result: PublishResult): void {
  terminal.error('❌ Status: BLOCKED');
  terminal.info('');

  terminal.info('Reasons:');

  for (const reason of result.eligibility.reasons) {
    terminal.info(`  • ${reason}`);
  }

  terminal.info('');
}

function renderFooter(result: PublishResult): void {
  terminal.info(`Duration: ${result.durationMs}ms`);
}
