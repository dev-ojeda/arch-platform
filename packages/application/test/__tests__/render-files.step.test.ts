// packages/application/test/__tests__/render-files.step.test.ts

import type {
  RenderTemplateInput,
  RenderedFile,
  ResolvedTemplate,
  TemplateRendererPort,
} from '@arch/contracts';
import { createTestPipelineContext } from '@arch/testing';
import { describe, expect, it } from 'vitest';

import { RenderFilesStep } from '../../src/generation/steps/render-files.step.js';
import { createResolvedTemplateVariables } from '../createResolvedTemplateVariables.js';

class FakeTemplateRenderer implements TemplateRendererPort {
  async render(files: RenderTemplateInput[]): Promise<RenderedFile[]> {
    return Promise.resolve(
      files.map((file) => ({
        path: file.path,
        content: `rendered:${file.template}`,
      })),
    );
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

        outputPath: 'controllers/UserController.ts',
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
});
