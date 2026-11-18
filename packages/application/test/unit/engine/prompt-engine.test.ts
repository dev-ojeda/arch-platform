import { describe, expect, it, vi } from 'vitest';

import type {
  BooleanField,
  NamedVariables,
  PromptAdapter,
  PromptField,
  PromptSchema,
  SelectField,
  SelectOption,
  StringField,
} from '@arch-platform/contracts';

import { PromptEngine } from '../../../src/generation/engine/prompt-engine.js';

interface TestVariables extends NamedVariables {
  name: string;
  framework: string;
  enabled: boolean;
}

function createAdapter(answers: Record<string, unknown> = {}): PromptAdapter {
  return {
    async input<TValues extends NamedVariables>(
      field: StringField<TValues>,
    ): Promise<string | undefined> {
      return answers[String(field.name)] as string | undefined;
    },

    async select<TValues extends NamedVariables>(
      field: SelectField<TValues>,
      _options: SelectOption[],
    ): Promise<string | undefined> {
      return answers[String(field.name)] as string | undefined;
    },

    async boolean<TValues extends NamedVariables>(
      field: BooleanField<TValues>,
    ): Promise<boolean | undefined> {
      return answers[String(field.name)] as boolean | undefined;
    },
  };
}

function createSchema<TValues extends NamedVariables>(
  ...fields: PromptField<TValues>[]
): PromptSchema<TValues> {
  return {
    id: 'test-schema',
    title: 'Test schema',
    fields,
  };
}

describe('PromptEngine', () => {
  describe('string fields', () => {
    it('should resolve a string value', async () => {
      const engine = new PromptEngine(createAdapter({ name: 'orders' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        required: true,
      });

      const result = await engine.collect(schema);

      expect(result.name).toBe('orders');
    });

    it('should use defaultValue when the adapter returns undefined', async () => {
      const engine = new PromptEngine(createAdapter());

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        defaultValue: 'orders',
      });

      const result = await engine.collect(schema);

      expect(result.name).toBe('orders');
    });

    it('should reject an empty required string', async () => {
      const engine = new PromptEngine(createAdapter());

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        required: true,
      });

      await expect(engine.collect(schema)).rejects.toThrow('Field "name" is required');
    });

    it('should reject strings shorter than minLength', async () => {
      const engine = new PromptEngine(createAdapter({ name: 'ab' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        minLength: 3,
      });

      await expect(engine.collect(schema)).rejects.toThrow('must contain at least 3 characters');
    });

    it('should reject strings longer than maxLength', async () => {
      const engine = new PromptEngine(createAdapter({ name: 'orders-service' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        maxLength: 5,
      });

      await expect(engine.collect(schema)).rejects.toThrow('must contain at most 5 characters');
    });

    it('should reject strings that do not match pattern', async () => {
      const engine = new PromptEngine(createAdapter({ name: 'Orders Service' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        pattern: /^[a-z][a-z0-9-]*$/,
      });

      await expect(engine.collect(schema)).rejects.toThrow('has an invalid format');
    });

    it('should accept strings that match pattern', async () => {
      const engine = new PromptEngine(createAdapter({ name: 'orders-service' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        pattern: /^[a-z][a-z0-9-]*$/,
      });

      const result = await engine.collect(schema);

      expect(result.name).toBe('orders-service');
    });

    it('should reset global regular expression state between validations', async () => {
      const pattern = /^[a-z]+$/g;

      const engine = new PromptEngine(
        createAdapter({
          name: 'orders',
          framework: 'orders',
        }),
      );

      const schema = createSchema<TestVariables>(
        {
          type: 'string',
          name: 'name',
          message: 'First validation',
          pattern,
        },
        {
          type: 'string',
          name: 'framework',
          message: 'Second validation',
          pattern,
        },
      );

      const result = await engine.collect(schema);

      expect(result.name).toBe('orders');
      expect(result.framework).toBe('orders');
    });

    it('should apply transform before validating the final value', async () => {
      const engine = new PromptEngine(createAdapter({ name: 'ab' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        transform: (value) => value.toUpperCase(),
        minLength: 3,
      });

      await expect(engine.collect(schema)).rejects.toThrow('must contain at least 3 characters');
    });
  });

  describe('custom validation', () => {
    it('should execute field.validate', async () => {
      const validate = vi.fn(async () => 'Invalid resource name');

      const engine = new PromptEngine(createAdapter({ name: 'orders' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        validate,
      });

      await expect(engine.collect(schema)).rejects.toThrow('Field "name": Invalid resource name');

      expect(validate).toHaveBeenCalledOnce();
    });

    it('should accept a value when field.validate returns undefined', async () => {
      const engine = new PromptEngine(createAdapter({ name: 'orders' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        validate: async (value) => (value.length >= 3 ? undefined : 'Name is too short'),
      });

      const result = await engine.collect(schema);

      expect(result.name).toBe('orders');
    });

    it('should validate the transformed value', async () => {
      const validate = vi.fn(async (value: string) =>
        value === 'ORDERS' ? undefined : 'Unexpected value',
      );

      const engine = new PromptEngine(createAdapter({ name: 'orders' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        transform: (value) => value.toUpperCase(),
        validate,
      });

      const result = await engine.collect(schema);

      expect(result.name).toBe('ORDERS');
      expect(validate).toHaveBeenCalledWith('ORDERS', expect.anything());
    });
  });

  describe('select fields', () => {
    const options: SelectOption[] = [
      { label: 'Express', value: 'express' },
      { label: 'Fastify', value: 'fastify' },
    ];

    it('should accept a valid selection', async () => {
      const engine = new PromptEngine(createAdapter({ framework: 'express' }));

      const schema = createSchema<TestVariables>({
        type: 'select',
        name: 'framework',
        message: 'Framework',
        options,
        required: true,
      });

      const result = await engine.collect(schema);

      expect(result.framework).toBe('express');
    });

    it('should reject a selection that does not exist in options', async () => {
      const engine = new PromptEngine(createAdapter({ framework: 'nestjs' }));

      const schema = createSchema<TestVariables>({
        type: 'select',
        name: 'framework',
        message: 'Framework',
        options,
      });

      await expect(engine.collect(schema)).rejects.toThrow('has an invalid selection');
    });

    it('should use defaultValue when the adapter returns undefined', async () => {
      const engine = new PromptEngine(createAdapter());

      const schema = createSchema<TestVariables>({
        type: 'select',
        name: 'framework',
        message: 'Framework',
        options,
        defaultValue: 'fastify',
      });

      const result = await engine.collect(schema);

      expect(result.framework).toBe('fastify');
    });

    it('should resolve dynamic options only once', async () => {
      const resolveOptions = vi.fn(async () => options);

      const engine = new PromptEngine(createAdapter({ framework: 'express' }));

      const schema = createSchema<TestVariables>({
        type: 'select',
        name: 'framework',
        message: 'Framework',
        options: resolveOptions,
      });

      await engine.collect(schema);

      expect(resolveOptions).toHaveBeenCalledOnce();
    });
  });

  describe('boolean fields', () => {
    it('should preserve true', async () => {
      const engine = new PromptEngine(createAdapter({ enabled: true }));

      const schema = createSchema<TestVariables>({
        type: 'boolean',
        name: 'enabled',
        message: 'Enable feature',
      });

      const result = await engine.collect(schema);

      expect(result.enabled).toBe(true);
    });

    it('should preserve false', async () => {
      const engine = new PromptEngine(createAdapter({ enabled: false }));

      const schema = createSchema<TestVariables>({
        type: 'boolean',
        name: 'enabled',
        message: 'Enable feature',
      });

      const result = await engine.collect(schema);

      expect(result.enabled).toBe(false);
    });

    it('should use defaultValue when the adapter returns undefined', async () => {
      const engine = new PromptEngine(createAdapter());

      const schema = createSchema<TestVariables>({
        type: 'boolean',
        name: 'enabled',
        message: 'Enable feature',
        defaultValue: true,
      });

      const result = await engine.collect(schema);

      expect(result.enabled).toBe(true);
    });

    it('should reject a missing required boolean without a default', async () => {
      const engine = new PromptEngine(createAdapter());

      const schema = createSchema<TestVariables>({
        type: 'boolean',
        name: 'enabled',
        message: 'Enable feature',
        required: true,
      });

      await expect(engine.collect(schema)).rejects.toThrow('Field "enabled" is required');
    });

    it('should default an optional unanswered boolean to false', async () => {
      const engine = new PromptEngine(createAdapter());

      const schema = createSchema<TestVariables>({
        type: 'boolean',
        name: 'enabled',
        message: 'Enable feature',
      });

      const result = await engine.collect(schema);

      expect(result.enabled).toBe(false);
    });
  });

  describe('conditional fields', () => {
    it('should skip fields when when returns false', async () => {
      const engine = new PromptEngine(createAdapter({ name: 'orders' }));

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
        when: async () => false,
      });

      const result = await engine.collect(schema);

      expect(result.name).toBeUndefined();
    });
  });

  describe('cancellation', () => {
    it('should reject when the signal is already aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      const engine = new PromptEngine(createAdapter());

      const schema = createSchema<TestVariables>({
        type: 'string',
        name: 'name',
        message: 'Resource name',
      });

      await expect(engine.collect(schema, { signal: controller.signal })).rejects.toThrow(
        'Prompt collection cancelled',
      );
    });
  });
});
