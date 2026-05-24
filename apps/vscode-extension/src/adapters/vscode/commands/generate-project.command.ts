// apps\vscode-extension\src\adapters\vscode\commands\generate-project.command.ts
import { GenerateProjectUseCase } from '@arch/application';
import * as vscode from 'vscode';

import { createGeneratorRegistry } from '../../../composition/create-generator-registry.js';
import { createGeneratorRuntime } from '../../../composition/create-generator-runtime.js';

export async function generateProjectCommand(): Promise<void> {
  console.log('[arch] generate project command started');

  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    vscode.window.showErrorMessage('No workspace opened');

    return;
  }

  console.log('[arch] workspace:', workspace.uri.fsPath);

  try {
    const runtime = createGeneratorRuntime();

    console.log('[arch] runtime created');

    const registry = createGeneratorRegistry();

    console.log('[arch] generator registry created');

    const useCase = new GenerateProjectUseCase(registry, runtime);

    console.log('[arch] use case created');

    await useCase.execute({
      generatorId: 'mvc',

      targetDir: workspace.uri.fsPath,
    });

    console.log('[arch] generation completed');

    vscode.window.showInformationMessage('Project generated successfully');
  } catch (error) {
    console.error('[arch] generation failed', error);

    const message = error instanceof Error ? error.message : 'Unknown error';

    vscode.window.showErrorMessage(`Generation failed: ${message}`);
  }
}
