// packages/cli/src/renderers/render-publish.ts

import type { PublishResult } from '@arch-platform/application';

import { terminal } from '../ui/terminal.js';

export function renderPublishResult(result: PublishResult): void {
  renderHeader(result);

  if (!result.success) {
    renderBlocked(result);
  } else if (result.dryRun) {
    renderDryRun();
  } else {
    renderPublished(result);
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

function renderDryRun(): void {
  terminal.success('✅ Status: ELIGIBLE');
  terminal.info('Mode: DRY RUN');
  terminal.info('No publication was performed.');
  terminal.info('');
}

function renderPublished(result: PublishResult): void {
  terminal.success('✅ Status: PUBLISHED');
  terminal.info('Mode: LIVE');

  if (result.publication) {
    terminal.info(`Package: ${result.publication.packageName}`);
    terminal.info(`Version: ${result.publication.version}`);

    if (result.publication.integrity) {
      terminal.info(`Integrity: ${result.publication.integrity}`);
    }

    if (result.publication.tarball) {
      terminal.info(`Tarball: ${result.publication.tarball}`);
    }
  }

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
