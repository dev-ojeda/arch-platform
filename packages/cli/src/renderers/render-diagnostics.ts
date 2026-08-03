// packages/cli/src/renderers/render-diagnostics.ts

import type { GovernanceResult } from '@arch/governance';
import type { Diagnostic } from '@arch/platform-model';

import { logger } from '../ui/logger.js';

import { formatterDiagnostic } from './formatter-diagnostic.js';

function renderDiagnostics(diagnostics: readonly Diagnostic[]): void {
  for (const diagnostic of diagnostics) {
    switch (diagnostic.severity) {
      case 'error':
        logger.error(formatterDiagnostic(diagnostic));
        break;

      case 'warning':
        logger.warn(formatterDiagnostic(diagnostic));
        break;

      default:
        logger.info(formatterDiagnostic(diagnostic));
    }
  }
}
export function renderGovernanceResult(result: GovernanceResult): void {
  if (result.diagnostics.length === 0) {
    logger.info(formatSuccess(result));
  } else {
    renderDiagnostics(result.diagnostics);
  }

  logger.info(`Rules evaluated: ${result.executions.length} (${result.durationMs}ms)`);
}
function formatSuccess(result: GovernanceResult): string {
  switch (result.scope.kind) {
    case 'package':
      return `✓ package validation passed: ${result.scope.packageName}`;

    case 'workspace':
      return '✓ workspace validation passed';

    case 'changed':
      return '✓ changed packages validation passed';
  }
}
