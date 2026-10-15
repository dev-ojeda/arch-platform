// packages/cli/src/renderers/render-sync.ts

import type { SyncRegistryResult } from '@arch-platform/application';

import { terminal } from '../ui/terminal.js';

export function renderSyncResult(result: SyncRegistryResult): void {
  renderHeader(result);

  if (result.success) {
    renderSynchronized(result);
  } else {
    renderFailed();
  }

  renderFooter(result);
}

function renderHeader(result: SyncRegistryResult): void {
  terminal.info('');
  terminal.info('ARCH Sync');
  terminal.info('──────────────────────────────────────────────');
  terminal.info(`Scope: ${result.scope}`);
  terminal.info('');
}

function renderSynchronized(result: SyncRegistryResult): void {
  terminal.success('✅ Status: SYNCHRONIZED');
  terminal.info(`Packages synchronized: ${result.packagesSynchronized}`);
  terminal.info(`Versions synchronized: ${result.versionsSynchronized}`);
  terminal.info('');
}

function renderFailed(): void {
  terminal.error('❌ Status: FAILED');
  terminal.info('');
}

function renderFooter(result: SyncRegistryResult): void {
  terminal.info(`Duration: ${result.durationMs}ms`);
}
