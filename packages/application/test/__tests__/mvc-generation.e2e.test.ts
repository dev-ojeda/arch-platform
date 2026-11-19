// packages/application/test/__tests__/mvc-generation.e2e.test.ts

import { describe, expect, it } from 'vitest';

import type {
  GenerationContext,
  RenderedFile,
  RenderTemplateInput,
  TemplateRendererPort,
} from '@arch-platform/contracts';

import { GeneratorValidationError } from '../../src/generation/errors/generator-validation-error.js';
import { RenderFilesStep } from '../../src/generation/steps/render-files.step.js';
import { ResolveTemplatesStep } from '../../src/generation/steps/resolve-templates.step.js';
import { createResolvedTemplateVariables } from '../createResolvedTemplateVariables.js';
import { createTestGenerator } from '../fixtures/generators/create-test-generator.js';
import { createTestPipelineContext } from '../fixtures/pipeline/create-test-pipeline-context.js';

class FakeMvcRenderer implements TemplateRendererPort {
  async render(files: RenderTemplateInput[]): Promise<RenderedFile[]> {
    return files.map((file) => {
      const output = file.output.replace(/{{\s*([^}]+)\s*}}/g, (_, key: string) => {
        const value = key
          .split('.')
          .reduce<unknown>(
            (current, segment) =>
              current && typeof current === 'object'
                ? (current as Record<string, unknown>)[segment]
                : undefined,
            file.variables,
          );

        return String(value ?? '');
      });

      return {
        path: output,
        content: `generated:${output}`,
      };
    });
  }
}

describe('MVC Generation', () => {
  it('generates mvc artifacts', async () => {
    const generator = createTestGenerator({
      templates: [
        {
          template: 'frameworks/express/controller.hbs',
          output: '{{folderLayout.controller}}/{{controllerName}}{{fileExtension}}',
        },
        {
          template: 'frameworks/express/service.hbs',
          output: '{{folderLayout.service}}/{{serviceName}}{{fileExtension}}',
        },
        {
          template: 'frameworks/express/repository.hbs',
          output: '{{folderLayout.repository}}/{{repositoryName}}{{fileExtension}}',
        },
        {
          template: 'frameworks/express/model.hbs',
          output: '{{folderLayout.model}}/{{modelName}}{{fileExtension}}',
        },
      ],
    });

    const context = createTestPipelineContext({
      generator,
      resolvedVariables: createResolvedTemplateVariables(),
    });

    await new ResolveTemplatesStep().execute(context);
    await new RenderFilesStep(new FakeMvcRenderer()).execute(context);

    expect(context.files).toHaveLength(4);

    expect(context.files.map((file) => file.path)).toEqual([
      'controllers/UserController.ts',
      'services/UserService.ts',
      'repositories/UserRepository.ts',
      'models/User.ts',
    ]);
  });

  it('throws when generator is missing', async () => {
    const step = new ResolveTemplatesStep();

    const context = {
      resolvedVariables: {},
    } as GenerationContext;

    await expect(step.execute(context)).rejects.toBeInstanceOf(GeneratorValidationError);
  });
});
