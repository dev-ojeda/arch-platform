import { describe, expect, it } from 'vitest';

import type { NamedVariables } from '@arch-platform/contracts';

import { DuplicateGeneratorError } from '../../../src/errors/registry/duplicate-generator.error.js';
import { GeneratorRegistry } from '../../../src/registry/generators/generator-registry.js';
import { createTestGenerator } from '../../fixtures/generators/create-test-generator.js';

describe('GeneratorRegistry', () => {
  it('registers and retrieves a generator', () => {
    const registry = new GeneratorRegistry();
    const generator = createTestGenerator({
      descriptor: {
        id: 'test-generator',
        displayName: '',
        version: '',
        languages: [],
        frameworks: [],
      },
    });

    registry.register(generator);

    expect(registry.get('test-generator')).toBe(generator);
  });

  it('returns undefined when the generator does not exist', () => {
    const registry = new GeneratorRegistry();

    expect(registry.get('unknown-generator')).toBeUndefined();
  });

  it('checks whether a generator is registered', () => {
    const registry = new GeneratorRegistry();
    const generator = createTestGenerator({
      descriptor: {
        id: 'test-generator',
        displayName: '',
        version: '',
        languages: [],
        frameworks: [],
      },
    });

    expect(registry.has('test-generator')).toBe(false);

    registry.register(generator);

    expect(registry.has('test-generator')).toBe(true);
  });

  it('lists all registered generators', () => {
    const registry = new GeneratorRegistry();
    const first = createTestGenerator({
      descriptor: {
        id: 'first-generator',
        displayName: '',
        version: '',
        languages: [],
        frameworks: [],
      },
    });
    const second = createTestGenerator({
      descriptor: {
        id: 'second-generator',
        displayName: '',
        version: '',
        languages: [],
        frameworks: [],
      },
    });

    registry.register(first);
    registry.register(second);

    expect(registry.list()).toEqual([first, second]);
  });

  it('throws DuplicateGeneratorError when registering an existing ID', () => {
    const registry = new GeneratorRegistry();
    const generator = createTestGenerator({
      descriptor: {
        id: 'test-generator',
        displayName: '',
        version: '',
        languages: [],
        frameworks: [],
      },
    });

    registry.register(generator);

    expect(() => registry.register(generator)).toThrow(DuplicateGeneratorError);
    expect(() => registry.register(generator)).toThrow(
      'Generator already registered: test-generator',
    );
  });

  it('stores generators with different variable types', () => {
    type NameVariables = NamedVariables & {
      readonly name: string;
    };

    type PortVariables = NamedVariables & {
      readonly port: number;
    };

    const registry = new GeneratorRegistry();

    const first = createTestGenerator<NameVariables>({
      descriptor: {
        id: 'generator-with-name',
        displayName: '',
        version: '',
        languages: [],
        frameworks: [],
      },
    });

    const second = createTestGenerator<PortVariables>({
      descriptor: {
        id: 'generator-with-port',
        displayName: '',
        version: '',
        languages: [],
        frameworks: [],
      },
    });

    registry.register(first);
    registry.register(second);

    expect(registry.get('generator-with-name')).toBe(first);
    expect(registry.get('generator-with-port')).toBe(second);
    expect(registry.list()).toHaveLength(2);
  });
});
