// packages/code-analysis/src/symbols/documentation/markdown-generator.ts

import type { FunctionMetadata } from '../scanners/function-metadata.js';

export function generateMarkdown(functions: readonly FunctionMetadata[]): string {
  return functions
    .map((fn) => {
      const params = fn.parameters.map((p) => `- ${p.name}: ${p.type}`).join('\n');

      return [
        `## ${fn.name}`,
        '',
        '### Parameters',
        '',
        params || '_none_',
        '',
        '### Returns',
        '',
        fn.returnType,
        '',
      ].join('\n');
    })
    .join('\n');
}
