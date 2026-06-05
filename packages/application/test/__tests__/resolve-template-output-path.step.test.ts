// packages\application\test\__tests__\resolve-template-output-path.step.test.ts

import { createTestGenerator } from '@arch/testing/fixtures';
import { createTestPipelineContext } from '@arch/testing/pipeline';
import { describe, expect, it } from 'vitest';

import { ResolveTemplatesStep } from '../../src/generation/steps/resolve-templates.step.js';
import { createResolvedTemplateVariables } from '../createResolvedTemplateVariables.js';

describe('ResolveTemplatesStep', () => {
  it('resolves output variables', async () => {
    const context = createTestPipelineContext({
      generator: createTestGenerator(),

      variables: {
        name: 'user',
      },

      resolvedVariables: createResolvedTemplateVariables(),
    });

    const step = new ResolveTemplatesStep();

    await step.execute(context);

    expect(context.resolvedTemplates).toBeDefined();

    expect(context.resolvedTemplates?.map((template) => template.outputPath)).toContain(
      'services/UserService.ts',
    );
  });
});
