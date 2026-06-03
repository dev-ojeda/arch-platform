// packages/application/test/integration/generation-pipeline/resolve-templates.integration.test.ts

import type { TemplateVariables } from '@arch/contracts/variables';
import { createTestGenerationContext } from '@arch/testing/runtime';
import { describe, expect, it } from 'vitest';

import { ResolveVariablesStep } from '../../../src/generation/steps/resolve-variables.step.js';
import { GenerationPipeline, ResolveTemplatesStep } from '../../../src/testing/index.js';

describe('ResolveTemplatesStep integration', () => {
  it('resolves generator templates using resolved variables', async () => {
    const variables: TemplateVariables = {
      name: 'demo',
    };
    const context = createTestGenerationContext<TemplateVariables>({
      variables,
      generator: {
        descriptor: {
          id: 'test',
          displayName: 'Test Generator',
          version: '1.0.0',
          languages: [],
          frameworks: [],
        },

        schema: {
          id: 'test',
          title: 'Test',
          fields: [],
        },

        templates: [
          {
            template: 'README.hbs',
            output: 'README.md',
          },
        ],
      },
    });
    const pipeline = new GenerationPipeline({
      idGenerator: {
        generate: () => 'execution-1',
      },

      steps: [new ResolveVariablesStep(), new ResolveTemplatesStep()],
    });

    await pipeline.execute(context);

    expect(context.resolvedTemplates).toBeDefined();
    expect(context.resolvedTemplates).toHaveLength(1);

    const [resolvedTemplate] = context.resolvedTemplates!;

    expect(resolvedTemplate?.outputPath).toBe('README.md');
  });
});
