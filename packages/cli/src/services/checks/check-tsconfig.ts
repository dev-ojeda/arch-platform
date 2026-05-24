import fs from 'node:fs';

import ts from 'typescript';

export async function checkTsConfig() {
  const path = 'tsconfig.json';

  if (!fs.existsSync(path)) {
    return {
      name: 'tsconfig',
      success: false,
      message: 'tsconfig.json missing',
      details: [],
    };
  }

  try {
    const raw = fs.readFileSync(path, 'utf8');

    const parsed = ts.parseConfigFileTextToJson(path, raw);

    if (parsed.error) {
      return {
        name: 'tsconfig',
        success: false,
        message: 'Invalid tsconfig',
        details: [ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n')],
      };
    }

    return {
      name: 'tsconfig',
      success: true,
      message: 'tsconfig validated',
      details: [],
    };
  } catch (error) {
    return {
      name: 'tsconfig',
      success: false,
      message: 'Failed to parse tsconfig',
      details: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}
