// packages/cli/src/renderers/render-security.ts

import type { SecurityResult } from '@arch-platform/compliance';

import { terminal } from '../ui/terminal.js';

export function renderSecurityResult(result: SecurityResult): void {
  renderHeader(result);

  if (result.success) {
    renderSuccess(result);
  } else {
    renderFailure(result);
  }

  renderState(result);
  renderFooter(result);
}

function renderHeader(result: SecurityResult): void {
  terminal.info('');
  terminal.info('ARCH Security');
  terminal.info('──────────────────────────────────────────────');
  terminal.info(`Artifact: ${result.artifact}`);
  terminal.info('');
}

function renderSuccess(result: SecurityResult): void {
  switch (result.securityAction) {
    case 'evaluate':
      terminal.warn('⚠ Status: EVALUATION REQUIRED');
      break;

    case 'none':
      renderDecisionStatus(result);
      break;
  }

  terminal.info('');
}

function renderFailure(_result: SecurityResult): void {
  terminal.error('✖ Status: FAILED');
  terminal.info('');
}

function renderDecisionStatus(result: SecurityResult): void {
  switch (result.decisionStatus) {
    case 'allowed':
      terminal.success('✅ Status: ALLOWED');
      break;

    case 'review':
      terminal.warn('⚠ Status: REVIEW');
      break;

    case 'blocked':
      terminal.error('❌ Status: BLOCKED');
      break;
  }
}

function renderState(result: SecurityResult): void {
  terminal.info(`Previous status:    ${result.previousStatus ?? 'not evaluated'}`);
  terminal.info(`Evaluation status:  ${result.evaluationStatus}`);
  terminal.info(`Decision status:    ${result.decisionStatus}`);
  terminal.info('');
}

function renderFooter(result: SecurityResult): void {
  terminal.info(`Changes: ${result.changes} · ` + `${result.durationMs}ms`);
}
