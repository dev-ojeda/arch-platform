// packages\application\test\__tests__\mvc-resolve-templates.e2e.test.ts

import { describe, expect, it } from 'vitest';

import type { TemplateVariables } from '@arch-platform/contracts';

import { ResolveTemplatesStep } from '../../src/generation/steps/resolve-templates.step.js';
import { testGenerator } from '../fixtures/generators/test-generator.js';
import { createTestPipelineContext } from '../fixtures/pipeline/create-test-pipeline-context.js';

describe('MVC ResolveTemplatesStep', () => {
  it('preserves mvc output path expressions', async () => {
    const context = createTestPipelineContext({
      generator: testGenerator,
    });

    const step = new ResolveTemplatesStep<TemplateVariables>();

    await step.execute(context);

    const outputPaths =
      context.resolvedTemplates?.map((template) => template.template.output) ?? [];

    expect(outputPaths).toEqual([
      '{{folderLayout.controller}}/{{controllerName}}{{fileExtension}}',
      '{{folderLayout.service}}/{{serviceName}}{{fileExtension}}',
      '{{folderLayout.repository}}/{{repositoryName}}{{fileExtension}}',
      '{{folderLayout.model}}/{{modelName}}{{fileExtension}}',
    ]);
  });
});
