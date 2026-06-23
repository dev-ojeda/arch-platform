// packages/application/test/__tests__/mvc-generation.e2e.test.ts

import type {
  GenerationContext,
  RenderedFile,
  RenderTemplateInput,
  TemplateRendererPort,
} from '@arch/contracts';
import { createTestGenerator, createTestPipelineContext } from '@arch/testing';
import { describe, expect, it } from 'vitest';

import { GeneratorValidationError } from '../../src/generation/errors/generator-validation-error.js';
import { RenderFilesStep } from '../../src/generation/steps/render-files.step.js';
import { ResolveTemplatesStep } from '../../src/generation/steps/resolve-templates.step.js';
import { createResolvedTemplateVariables } from '../createResolvedTemplateVariables.js';

class FakeMvcRenderer implements TemplateRendererPort {
  async render(files: RenderTemplateInput[]): Promise<RenderedFile[]> {
    return Promise.resolve(
      files.map((file) => ({
        path: file.path,

        content: `generated:${file.path}`,
      })),
    );
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
