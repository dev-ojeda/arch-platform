import { describe, expect, it } from 'vitest';

import { normalizeTypeScriptComments } from '../../../src/hashing/normalize-typescript-comments.js';

describe('normalizeTypeScriptComments', () => {
  it('ignores changes to ordinary comments', () => {
    const first = normalizeTypeScriptComments('export const value = 1;\n// test\n');

    const second = normalizeTypeScriptComments('export const value = 1;\n// test 1\n');

    expect(first).toBe(second);
  });
  it('ignores adding or removing an ordinary comment', () => {
    const withoutComment = normalizeTypeScriptComments('export const value = 1;\n');

    const withComment = normalizeTypeScriptComments('export const value = 1;\n// test\n');

    expect(withComment).toBe(withoutComment);
  });
  it('ignores removing an ordinary comment at end of file', () => {
    const withoutComment = normalizeTypeScriptComments(
      "export type { TechnologyStack } from './technology-stack.js';",
    );

    const withComment = normalizeTypeScriptComments(
      "export type { TechnologyStack } from './technology-stack.js';\n// test 4",
    );

    expect(withComment).toBe(withoutComment);
  });
  it('preserves executable code changes', () => {
    const first = normalizeTypeScriptComments('export const value = 1;');

    const second = normalizeTypeScriptComments('export const value = 2;');

    expect(first).not.toBe(second);
  });

  it('preserves JSDoc comments', () => {
    const source = '/** Public API documentation */\nexport type Value = string;';

    expect(normalizeTypeScriptComments(source)).toBe(source);
  });

  it('preserves TypeScript directives', () => {
    const source = '// @ts-expect-error\nconst value: string = 123;';

    expect(normalizeTypeScriptComments(source)).toBe(source);
  });

  it('preserves triple-slash references', () => {
    const source = '/// <reference types="node" />\nexport {};';

    expect(normalizeTypeScriptComments(source)).toBe(source);
  });
});
