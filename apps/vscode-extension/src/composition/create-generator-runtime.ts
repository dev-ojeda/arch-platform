// apps\vscode-extension\src\composition\create-generator-runtime.ts
import * as path from 'node:path';

import { GeneratorRuntime } from '@arch-platform/application';
import { NodeFileSystemAdapter } from '@arch-platform/infrastructure';

import { VSCodePromptAdapter } from '../adapters/vscode-prompt-adapter.js';

import { createLanguageRegistry } from './create-language-registry.js';

export function createGeneratorRuntime(): GeneratorRuntime {
  return new GeneratorRuntime({
    promptAdapter: new VSCodePromptAdapter(),

    templateRoot: path.resolve(__dirname, '../../dist/templates'),

    languageRegistry: createLanguageRegistry(),

    defaultFs: new NodeFileSystemAdapter(),
  });
}
