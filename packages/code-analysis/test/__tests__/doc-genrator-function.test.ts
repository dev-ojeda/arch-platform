import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { scanFunctions } from '../../src/symbols/scanners/function-scanner.js';
import { scanClasses } from '../../src/symbols/scanners/scan-classes.js';
import { scanInterfaces } from '../../src/symbols/scanners/scan-interfaces.js';

describe('CreateTestDocGenerator', () => {
  const project = new Project({
    useInMemoryFileSystem: true,
  });
  it('should create documentation function', () => {
    project.createSourceFile(
      'example.ts',
      `
      export function sum(a: number, b: number): number {
        return a + b;
      }
    `,
    );
    const functions = scanFunctions(project);
    expect(functions).toHaveLength(1);
    expect(functions).toHaveLength(1);
    expect(functions[0]).toEqual({
      name: 'sum',
      sourceFile: '/example.ts',
      parameters: [
        {
          name: 'a',
          type: 'number',
        },
        {
          name: 'b',
          type: 'number',
        },
      ],
      returnType: 'number',
    });
  });
  it('should create documentation interface and class', () => {
    project.createSourceFile(
      'example-user.ts',
      `
      export interface User {
        id: string;
        name: string;
      }

      export class UserService {
        getUser(): User {
          return {
            id: '1',
            name: 'neo'
          };
        }
      }
    `,
    );
    const interfaces = scanInterfaces(project);

    expect(interfaces).toHaveLength(1);

    expect(interfaces[0]?.name).toBe('User');

    const classes = scanClasses(project);

    expect(classes).toHaveLength(1);

    expect(classes[0]?.name).toBe('UserService');
  });
});
