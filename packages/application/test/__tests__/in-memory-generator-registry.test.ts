// packages\application\test\__tests__\in-memory-generator-registry.test.ts

import { createTestGenerator } from '@arch/testing';
import { describe, expect, it } from 'vitest';

import { InMemoryGeneratorRegistry } from '../../src/generation/registry/in-memory-generator-registry.js';

describe('InMemoryGeneratorRegistry', () => {
  it('registers and retrieves a generator', async () => {
    const registry = new InMemoryGeneratorRegistry();

    const generator = createTestGenerator({
      descriptor: {
        id: 'mvc',
        displayName: 'MVC Generator',
        version: '1.0.0',
        languages: ['typescript'],
        frameworks: ['express'],
      },
    });

    registry.register(generator);

    await expect(registry.has('mvc')).resolves.toBe(true);

    await expect(registry.get('mvc')).resolves.toBe(generator);
  });

  it('lists registered generators', async () => {
    const registry = new InMemoryGeneratorRegistry();

    const generatorA = createTestGenerator({
      descriptor: {
        id: 'mvc',
        displayName: 'MVC Generator',
        version: '1.0.0',
        languages: ['typescript'],
        frameworks: ['express'],
      },
    });

    const generatorB = createTestGenerator({
      descriptor: {
        id: 'clean-architecture',
        displayName: 'MVC Generator',
        version: '1.0.0',
        languages: ['typescript'],
        frameworks: ['express'],
      },
    });

    registry.register(generatorA);
    registry.register(generatorB);

    await expect(registry.list()).resolves.toEqual([generatorA, generatorB]);
  });

  it('throws when registering duplicated ids', () => {
    const registry = new InMemoryGeneratorRegistry();

    const generator = createTestGenerator({
      descriptor: {
        id: 'mvc',
        displayName: 'MVC Generator',
        version: '1.0.0',
        languages: ['typescript'],
        frameworks: ['express'],
      },
    });

    registry.register(generator);

    expect(() => registry.register(generator)).toThrow('Generator "mvc" already registered');
  });

  it('throws when generator does not exist', async () => {
    const registry = new InMemoryGeneratorRegistry();

    await expect(registry.get('missing')).rejects.toThrow('Generator "missing" not found');
  });
});
