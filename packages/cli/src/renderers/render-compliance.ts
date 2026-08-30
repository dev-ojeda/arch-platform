// packages/cli/src/renderers/render-compliance.ts

import type { ComplianceResult } from '@arch/governance';

import { terminal } from '../ui/terminal.js';

import { formatterDiagnostic } from './formatter-diagnostic.js';

export function renderComplianceResult(result: ComplianceResult): void {
  renderHeader(result);

  if (result.diagnostics.length === 0) {
    renderSuccess(result);
  } else {
    renderFailure(result);
    renderDiagnostics(result);
  }

  renderFooter(result);
}

function renderHeader(result: ComplianceResult): void {
  terminal.info('');
  terminal.info('ARCH Compliance');
  terminal.info('──────────────────────────────────────────────');
  terminal.info(`Scope: ${formatScope(result)}`);
  terminal.info('');
}

function renderSuccess(result: ComplianceResult): void {
  terminal.success('✓ Status: PASSED');
  terminal.info('');
  terminal.info(formatSuccess(result));
}

function renderFailure(result: ComplianceResult): void {
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

function renderDiagnostics(result: ComplianceResult): void {
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

function renderFooter(result: ComplianceResult): void {
  terminal.info(
    `Rules evaluated: ${result.executions} · ` +
      `Changes: ${result.changes} · ` +
      `${result.durationMs}ms`,
  );
}

function formatScope(result: ComplianceResult): string {
  switch (result.scope.kind) {
    case 'package':
      return result.scope.packageName;

    case 'workspace':
      return 'workspace';
  }
}

function formatSuccess(result: ComplianceResult): string {
  switch (result.scope.kind) {
    case 'package':
      return `✓ Compliance passed for ${result.scope.packageName}`;

    case 'workspace':
      return '✓ Compliance passed for workspace';
  }
}
