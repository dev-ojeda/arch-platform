// packages/application/test/__tests__/render-files.step.test.ts

import { describe, expect, it, vi } from 'vitest';

import type {
  RenderTemplateInput,
  RenderedFile,
  ResolvedTemplate,
  TemplateRendererPort,
} from '@arch-platform/contracts';

import { RenderFilesStep } from '../../src/generation/steps/render-files.step.js';
import { createResolvedTemplateVariables } from '../createResolvedTemplateVariables.js';
import { createTestPipelineContext } from '../fixtures/pipeline/create-test-pipeline-context.js';

class FakeTemplateRenderer implements TemplateRendererPort {
  async render(files: RenderTemplateInput[]): Promise<RenderedFile[]> {
    return files.map((file) => ({
      path: 'controllers/UserController.ts',
      content: `rendered:${file.template}`,
    }));
  }
}

describe('RenderFilesStep', () => {
  it('renders templates into generated files', async () => {
    const context = createTestPipelineContext({
      resolvedVariables: createResolvedTemplateVariables(),
    });

    context.resolvedTemplates = [
      {
        template: {
          template: 'controller.hbs',
          output: 'controllers/{{controllerName}}{{fileExtension}}',
        },
      },
    ] as ResolvedTemplate[];

    const step = new RenderFilesStep(new FakeTemplateRenderer());

    await step.execute(context);

    expect(context.files).toEqual([
      {
        path: 'controllers/UserController.ts',
        content: 'rendered:controller.hbs',
      },
    ]);
  });

  it('throws when resolved variables are missing', async () => {
    const context = createTestPipelineContext();

    const step = new RenderFilesStep(new FakeTemplateRenderer());

    await expect(step.execute(context)).rejects.toThrow('Resolved variables not available');
  });

  it('throws when resolved templates are missing', async () => {
    const context = createTestPipelineContext({
      resolvedVariables: createResolvedTemplateVariables(),
    });

    const step = new RenderFilesStep(new FakeTemplateRenderer());

    await expect(step.execute(context)).rejects.toThrow('Resolved templates not available');
  });
  it('delegates output path resolution to the renderer', async () => {
    const context = createTestPipelineContext({
      resolvedVariables: createResolvedTemplateVariables(),
    });

    context.resolvedTemplates = [
      {
        template: {
          template: 'controller.hbs',
          output: 'controllers/{{controllerName}}{{fileExtension}}',
        },
      },
    ] as ResolvedTemplate[];

    const renderer = new FakeTemplateRenderer();
    const renderSpy = vi.spyOn(renderer, 'render');

    const step = new RenderFilesStep(renderer);

    await step.execute(context);

    expect(renderSpy).toHaveBeenCalledWith([
      {
        template: 'controller.hbs',
        output: 'controllers/{{controllerName}}{{fileExtension}}',
        variables: context.resolvedVariables,
      },
    ]);

    expect(context.files[0]?.path).toBe('controllers/UserController.ts');
  });
  it.each(['skip', 'overwrite', 'error', 'append', 'merge'] as const)(
    'preserves the %s overwrite policy',
    async (overwrite) => {
      const context = createTestPipelineContext({
        resolvedVariables: createResolvedTemplateVariables(),
      });

      context.resolvedTemplates = [
        {
          template: {
            template: 'controller.hbs',
            output: 'controllers/UserController.ts',
            overwrite,
          },
        },
      ] as ResolvedTemplate[];

      const step = new RenderFilesStep(new FakeTemplateRenderer());

      await step.execute(context);

      expect(context.files[0]?.overwrite).toBe(overwrite);
    },
  );
  it('keeps overwrite undefined when no policy is declared', async () => {
    const context = createTestPipelineContext({
      resolvedVariables: createResolvedTemplateVariables(),
    });

    context.resolvedTemplates = [
      {
        template: {
          template: 'controller.hbs',
          output: 'controllers/UserController.ts',
        },
      },
    ] as ResolvedTemplate[];

    const step = new RenderFilesStep(new FakeTemplateRenderer());

    await step.execute(context);

    expect(context.files[0]?.overwrite).toBeUndefined();
  });
});
