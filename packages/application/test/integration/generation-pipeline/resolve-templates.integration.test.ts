// packages/application/test/integration/generation-pipeline/resolve-templates.integration.test.ts

import { describe, expect, it } from 'vitest';

import type { TemplateVariables } from '@arch-platform/contracts';
import { createTestGenerationContext } from '@arch-platform/testing';

import { GenerationPipeline } from '../../../src/generation/pipeline/generation-pipeline.js';
import { ResolveTemplatesStep } from '../../../src/generation/steps/resolve-templates.step.js';
import { ResolveVariablesStep } from '../../../src/generation/steps/resolve-variables.step.js';

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
