// packages/application/test/integration/generation-pipeline/resolve-templates.integration.test.ts

import { describe, expect, it } from 'vitest';

import type { TemplateVariables } from '@arch-platform/contracts';

import { GenerationPipeline } from '../../../src/generation/pipeline/generation-pipeline.js';
import { ResolveTemplatesStep } from '../../../src/generation/steps/resolve-templates.step.js';
import { ResolveVariablesStep } from '../../../src/generation/steps/resolve-variables.step.js';
import { createTestLanguageConventionRegistry } from '../../fixtures/generation/language-conventions/language-convention-registry.fixture.js';
import { createTestPipelineContext } from '../../fixtures/pipeline/create-test-pipeline-context.js';

describe('ResolveTemplatesStep integration', () => {
  it('resolves generator templates using resolved variables', async () => {
    const variables: TemplateVariables = {
      name: 'Demo',
    };

    const context = createTestPipelineContext<TemplateVariables>({
      generator: {
        descriptor: {
          id: 'test',
          displayName: 'Test Generator',
          version: '1.0.0',
          languages: ['typescript'],
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
      variables,
      languageId: 'typescript',
    });

    const pipeline = new GenerationPipeline({
      idGenerator: {
        generate: () => 'execution-1',
      },
      steps: [
        new ResolveVariablesStep(createTestLanguageConventionRegistry()),
        new ResolveTemplatesStep(),
      ],
    });
    await pipeline.execute(context);

    expect(context.resolvedVariables).toBeDefined();
    expect(context.resolvedTemplates).toHaveLength(1);

    const [resolvedTemplate] = context.resolvedTemplates!;

    expect(resolvedTemplate?.template.output).toBe('README.md');

    expect(context.resolvedVariables?.fileExtension).toBe('.ts');
    expect(context.resolvedVariables?.controllerName).toBe('DemoController');
    expect(context.resolvedVariables?.serviceName).toBe('DemoService');
    expect(context.resolvedVariables?.repositoryName).toBe('DemoRepository');
    expect(context.resolvedVariables?.modelName).toBe('Demo');
  });
});
