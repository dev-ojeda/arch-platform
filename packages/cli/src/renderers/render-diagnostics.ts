// packages/cli/src/renderers/render-diagnostics.ts

import type { GovernanceEngineResult, GovernanceScope } from '@arch/governance';
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
export function renderGovernanceResult(
  result: GovernanceEngineResult,
  scope: GovernanceScope,
): void {
  if (result.diagnostics.length === 0) {
    logger.info(getSuccessMessage(scope));
  } else {
    renderDiagnostics(result.diagnostics);
  }

  logger.info(`Rules evaluated: ${result.executions.length} (${result.durationMs}ms)`);
}
function getSuccessMessage(scope: GovernanceScope): string {
  switch (scope.kind) {
    case 'package':
      return `✓ package validation passed: ${scope.packageName}`;

    case 'workspace':
      return '✓ workspace validation passed';

    case 'changed':
      return '✓ changed packages validation passed';
  }
}
