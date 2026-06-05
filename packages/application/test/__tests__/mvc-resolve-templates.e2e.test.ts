// packages\application\test\__tests__\mvc-resolve-templates.e2e.test.ts

import type { MvcVariables } from '@arch/generator-mvc';
import { mvcGenerator } from '@arch/generator-mvc/definition';
import { createTestPipelineContext } from '@arch/testing/pipeline';
import { describe, expect, it } from 'vitest';

import { ResolveTemplatesStep } from '../../src/generation/steps/resolve-templates.step.js';
import { deriveTemplateVariables } from '../../src/generation/variables/derive-template-variables.js';

describe('MVC ResolveTemplatesStep', () => {
  it('resolves mvc output paths', async () => {
    const variables: MvcVariables = {
      name: 'user',
      framework: 'express',
      language: 'typescript',
    };

    const context = createTestPipelineContext({
      generator: mvcGenerator,
      variables,
      resolvedVariables: deriveTemplateVariables(variables),
    });

    const step = new ResolveTemplatesStep<MvcVariables>();

    await step.execute(context);

    const outputPaths = context.resolvedTemplates?.map((template) => template.outputPath) ?? [];

    expect(outputPaths).toContain('controllers/UserController.ts');

    expect(outputPaths).toContain('services/UserService.ts');

    expect(outputPaths).toContain('repositories/UserRepository.ts');

    expect(outputPaths).toContain('models/User.ts');
  });
});
