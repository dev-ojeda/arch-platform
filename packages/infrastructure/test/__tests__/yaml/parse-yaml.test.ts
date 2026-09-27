import { describe, expect, it } from 'vitest';

import { parseYaml } from '../../../src/serialization/parse-yaml.js';

describe('parseYaml', () => {
  it('parses a YAML object', () => {
    const result = parseYaml<{ name: string; version: string }>(`
name: arch-platform
version: 0.1.0
`);

    expect(result).toEqual({
      name: 'arch-platform',
      version: '0.1.0',
    });
  });

  it('parses nested objects and arrays', () => {
    const result = parseYaml<{
      packages: string[];
      config: { enabled: boolean };
    }>(`
packages:
  - packages/*
config:
  enabled: true
`);

    expect(result).toEqual({
      packages: ['packages/*'],
      config: {
        enabled: true,
      },
    });
  });

  it('throws when YAML is invalid', () => {
    expect(() => parseYaml('name: [invalid')).toThrow();
  });
});
