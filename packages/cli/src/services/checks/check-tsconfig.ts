// packages/cli/src/services/checks/check-tsconfig.ts
import fs from 'node:fs';

export async function checkTsConfig() {
  const exists = fs.existsSync('tsconfig.base.json');

  if (!exists) {
    return {
      name: 'tsconfig',
      success: false,
      message: 'tsconfig.base.json missing',
      details: [],
    };
  }

  try {
    const content = JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf8'));

    const hasCompilerOptions = !!content.compilerOptions;

    return {
      name: 'tsconfig',
      success: hasCompilerOptions,
      message: hasCompilerOptions ? 'tsconfig validated' : 'compilerOptions missing',
      details: [],
    };
  } catch {
    return {
      name: 'tsconfig',
      success: false,
      message: 'Invalid tsconfig JSON',
      details: [],
    };
  }
}
