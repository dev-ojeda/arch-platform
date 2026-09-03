// packages/cli/src/renderers/formatter-diagnostic.ts

import type { DiagnosticCli } from './diagnostic-cli.js';

export function formatterDiagnostic(diagnostic: DiagnosticCli): string {
  const file = diagnostic.location?.file;
  const location = file ? terminalLink(file, toFileUrl(file)) : undefined;

  const lines = [`✖ ${diagnostic.code}`, `  `];

  if (location) {
    lines.push(` ${location}`);
  }

  lines.push(`  ${diagnostic.message}`);

  if (diagnostic.hint) {
    lines.push(`  Hint: ${diagnostic.hint}`);
  }

  return lines.join('\n');
}
function terminalLink(label: string, target: string): string {
  return `\u001B]8;;${target}\u001B\\${label}\u001B]8;;\u001B\\`;
}
export function toFileUrl(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');

  if (normalized.startsWith('vscode:///')) {
    return normalized;
  }

  if (/^[A-Za-z]:\//.test(normalized)) {
    return `vscode:///${encodeURI(normalized)}`;
  }

  if (normalized.startsWith('/')) {
    return `vscode://${encodeURI(normalized)}`;
  }

  return `vscode://${encodeURI(normalized)}`;
}
