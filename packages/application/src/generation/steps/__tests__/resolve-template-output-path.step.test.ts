// packages/application/src/generation/steps/__tests__/resolve-template-output-path.step.test.ts

import { createTestPipelineContext, testGenerator } from '@arch/testing';
import { describe, expect, it } from 'vitest';

import { ResolveTemplatesStep } from '../../steps/resolve-templates.step.js';

describe('ResolveTemplatesStep', () => {
  it('resolves output variables', async () => {
    const context = createTestPipelineContext({
      variables: {
        name: 'user',
      },
    });
    console.debug('context', context);
    context.generator = testGenerator;

    context.resolvedVariables = {
      ...context.variables,

      className: 'User',

      controllerName: 'UserController',

      serviceName: 'UserService',

      repositoryName: 'UserRepository',

      modelName: 'User',

      fileExtension: '.ts',

      folderLayout: {
        controller: 'controllers',

        service: 'services',

        repository: 'repositories',

        model: 'models',
      },
    };

    const step = new ResolveTemplatesStep();
    console.debug('context', context);
    await step.execute(context);

    expect(context.resolvedTemplates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          outputPath: 'services/UserService.ts',
        }),
      ]),
    );
  });
});
