import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { buildSymbolGraph } from '../../src/symbol-graph/build-symbol-graph.js';

describe('symbol relationship graph', () => {
  it('should create property type relationships', () => {
    const project = new Project({
      useInMemoryFileSystem: true,
    });

    project.createSourceFile(
      'example.ts',
      `
      export interface User {
        id: string;
      }

      export class UserService {

        private user: User;

        getUser(): User {
          return this.user;
        }
      }
      `,
    );

    const graph = buildSymbolGraph(project);

    const userNode = graph.nodes.find((node) => node.name === 'UserService');

    expect(userNode).toBeDefined();

    const edges = graph.edges.filter((edge) => edge.from.includes('UserService'));

    expect(edges.length).toBeGreaterThan(0);

    expect(edges.some((edge) => edge.kind === 'property-type')).toBe(true);

    expect(edges.some((edge) => edge.to.includes('User'))).toBe(true);
  });
});
