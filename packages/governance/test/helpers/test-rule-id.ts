// test/helpers/test-rule-id.ts

export const TestRuleId = {
  TestSuccess: 'test-success',
  TestFailure: 'test-failure',
} as const;
export type TestRuleId = (typeof TestRuleId)[keyof typeof TestRuleId];
