// packages/contracts/src/prompts/prompt-values.ts

export type PromptPrimitive = string | number | boolean | null | undefined;

export type PromptValue = PromptPrimitive | PromptPrimitive[] | Record<string, unknown>;

export type PromptValues = Record<string, PromptValue>;
