// packages\application\test\__tests__\resolve-templates.step.test.ts

import { describe, expect, it } from 'vitest';

import { GeneratorValidationError } from '../../src/generation/errors/generator-validation-error.js';
import { ResolveTemplatesStep } from '../../src/generation/steps/resolve-templates.step.js';
import { createTestGenerator } from '../fixtures/generators/create-test-generator.js';
import { createTestPipelineContext } from '../fixtures/pipeline/create-test-pipeline-context.js';

describe('ResolveTemplatesStep', () => {
  it('preserves template output expressions for the renderer', async () => {
    const context = createTestPipelineContext({
      generator: createTestGenerator({
        templates: [
          {
            template: 'service.hbs',
            output: 'services/{{serviceName}}{{fileExtension}}',
          },
        ],
      }),
    });

    const step = new ResolveTemplatesStep();

    await step.execute(context);

    expect(context.resolvedTemplates).toHaveLength(1);

    expect(context.resolvedTemplates?.[0]?.template.output).toBe(
      'services/{{serviceName}}{{fileExtension}}',
    );
  });

  it('throws when generator is missing', async () => {
    const context = createTestPipelineContext({
      generator: null,
    });

    const step = new ResolveTemplatesStep();

    await expect(step.execute(context)).rejects.toBeInstanceOf(GeneratorValidationError);
  });
});
