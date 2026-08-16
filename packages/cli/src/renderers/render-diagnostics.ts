// packages/cli/src/renderers/render-diagnostics.ts

import type { GovernanceResult } from '@arch/governance';

import { terminal } from '../ui/terminal.js';

import { formatterDiagnostic } from './formatter-diagnostic.js';

export function renderGovernanceResult(result: GovernanceResult): void {
  renderHeader(result);
  if (result.diagnostics.length === 0) {
    renderSuccess(result);
  } else {
    renderFailure(result);
    renderDiagnostics(result);
  }
  renderFooter(result);
}
function renderHeader(result: GovernanceResult): void {
  terminal.info('');
  terminal.info('ARCH Governance');
  terminal.info('──────────────────────────────────────────────');
  terminal.info(`Scope: ${formatScope(result)}`);
  terminal.info('');
}
function renderSuccess(result: GovernanceResult): void {
  terminal.success('✓ Status: PASSED');
  terminal.info('');
  terminal.info(formatSuccess(result));
}
function renderFailure(result: GovernanceResult): void {
  const errors = result.diagnostics.filter((diagnostic) => diagnostic.severity === 'error');
  const warnings = result.diagnostics.filter((diagnostic) => diagnostic.severity === 'warning');
  terminal.error('✖ Status: FAILED');
  terminal.info('');
  if (errors.length > 0) {
    terminal.error(` ${errors.length} error(s)`);
  }
  if (warnings.length > 0) {
    terminal.warn(` ${warnings.length} warning(s)`);
  }
  terminal.info('');
}
function renderDiagnostics(result: GovernanceResult): void {
  for (const diagnostic of result.diagnostics) {
    switch (diagnostic.severity) {
      case 'error':
        terminal.error(formatterDiagnostic(diagnostic));
        break;
      case 'warning':
        terminal.warn(formatterDiagnostic(diagnostic));
        break;
      default:
        terminal.info(formatterDiagnostic(diagnostic));
    }
    terminal.info('');
  }
}
function renderFooter(result: GovernanceResult): void {
  terminal.info(`Rules evaluated: ${result.executions.length} · ${result.durationMs}ms`);
}
function formatScope(result: GovernanceResult): string {
  switch (result.scope.kind) {
    case 'package':
      return result.scope.packageName;
    case 'workspace':
      return 'workspace';
    case 'changed':
      return 'changed packages';
  }
}
function formatSuccess(result: GovernanceResult): string {
  switch (result.scope.kind) {
    case 'package':
      return `✓ No architecture violations found in ${result.scope.packageName}`;
    case 'workspace':
      return '✓ No architecture violations found';
    case 'changed':
      return '✓ No architecture violations found in changed packages';
  }
}
