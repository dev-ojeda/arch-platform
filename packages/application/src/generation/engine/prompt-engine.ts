// packages/application/src/generation/engine/prompt-engine.ts

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

export interface PromptEngineContext {
  signal?: AbortSignal;
}

export class PromptEngine {
  constructor(private readonly adapter: PromptAdapter) {}

  async collect<TValues extends NamedVariables>(
    schema: PromptSchema<TValues>,
    ctx?: PromptEngineContext,
  ): Promise<TValues> {
    const result = Object.create(null) as TValues;
    const output = result as Record<string, unknown>;

    for (const field of schema.fields) {
      this.assertNotCancelled(ctx);

      if (!(await this.shouldAsk(field, result))) {
        continue;
      }

      const value = await this.resolveField(field, result);
      const transformed = await this.applyTransform(field, value);

      await this.validateField(field, transformed, result);

      output[field.name as string] = transformed;
    }

    return result;
  }

  private assertNotCancelled(ctx?: PromptEngineContext): void {
    if (!ctx?.signal?.aborted) {
      return;
    }

    throw new Error('Prompt collection cancelled');
  }

  private async resolveField<TValues extends NamedVariables>(
    field: PromptField<TValues>,
    values: TValues,
  ): Promise<unknown> {
    switch (field.type) {
      case 'string':
        return this.resolveString(field);

      case 'select':
        return this.resolveSelect(field, values);

      case 'boolean':
        return this.resolveBoolean(field);

      default:
        return this.assertNever(field);
    }
  }

  private async resolveString<TValues extends NamedVariables>(
    field: StringField<TValues>,
  ): Promise<string> {
    const input = await this.adapter.input(field);

    const value = input?.trim() ? input : (field.defaultValue?.toString() ?? '');

    return value;
  }

  private async resolveSelect<TValues extends NamedVariables>(
    field: SelectField<TValues>,
    values: TValues,
  ): Promise<string> {
    const options = await this.resolveSelectOptions(field, values);

    const selected = await this.adapter.select(field, options);
    const value = selected ?? field.defaultValue?.toString() ?? '';

    if (value !== '' && !options.some((option) => option.value === value)) {
      throw new Error(`Field "${String(field.name)}" has an invalid selection: "${value}"`);
    }

    return value;
  }

  private async resolveBoolean<TValues extends NamedVariables>(
    field: BooleanField<TValues>,
  ): Promise<boolean> {
    const value = await this.adapter.boolean(field);

    if (value !== undefined) {
      return value;
    }

    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }

    if (field.required) {
      throw new Error(`Field "${String(field.name)}" is required`);
    }

    return false;
  }

  private async resolveSelectOptions<TValues extends NamedVariables>(
    field: SelectField<TValues>,
    values: TValues,
  ): Promise<SelectOption[]> {
    if (typeof field.options !== 'function') {
      return field.options;
    }

    return await field.options(values);
  }

  private async validateField<TValues extends NamedVariables>(
    field: PromptField<TValues>,
    value: unknown,
    values: TValues,
  ): Promise<void> {
    this.validateRequired(field, value);

    if (field.type === 'string' && typeof value === 'string') {
      this.validateString(field, value);
    }

    if (!field.validate) {
      return;
    }

    const message = await field.validate(value as never, values);

    if (message) {
      throw new Error(`Field "${String(field.name)}": ${message}`);
    }
  }

  private validateRequired<TValues extends NamedVariables>(
    field: PromptField<TValues>,
    value: unknown,
  ): void {
    if (!field.required) {
      return;
    }

    const isEmpty = value === undefined || value === null || value === '';

    if (!isEmpty) {
      return;
    }

    throw new Error(`Field "${String(field.name)}" is required`);
  }

  private validateString<TValues extends NamedVariables>(
    field: StringField<TValues>,
    value: string,
  ): void {
    if (field.minLength !== undefined && value.length < field.minLength) {
      throw new Error(
        `Field "${String(field.name)}" must contain at least ${field.minLength} characters`,
      );
    }

    if (field.maxLength !== undefined && value.length > field.maxLength) {
      throw new Error(
        `Field "${String(field.name)}" must contain at most ${field.maxLength} characters`,
      );
    }

    if (field.pattern) {
      field.pattern.lastIndex = 0;
      const matches = field.pattern.test(value);
      field.pattern.lastIndex = 0;

      if (!matches) {
        throw new Error(`Field "${String(field.name)}" has an invalid format`);
      }
    }
  }

  private async applyTransform<TValues extends NamedVariables, TValue>(
    field: PromptField<TValues>,
    value: TValue,
  ): Promise<TValue> {
    if (!field.transform) {
      return value;
    }

    return (await field.transform(value as never)) as TValue;
  }

  private async shouldAsk<TValues extends NamedVariables>(
    field: PromptField<TValues>,
    values: TValues,
  ): Promise<boolean> {
    if (!field.when) {
      return true;
    }

    return await field.when(values);
  }

  private assertNever(_value: never): never {
    throw new TypeError('Unsupported field type');
  }
}
