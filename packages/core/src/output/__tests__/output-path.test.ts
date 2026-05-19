// packages/core/src/generation/__tests__/output-path.test.ts

import { describe, expect, it } from "vitest";

import { resolveOutputPath } from "../../generation/output/output-path.ts";

describe("resolveOutputPath", () => {
  it("should resolve safe paths", () => {
    const outputPath = resolveOutputPath("/project", "src/users.ts");
    console.debug("outputPath", outputPath);
    expect(outputPath).toContain("src");
  });

  it("should prevent path traversal", () => {
    expect(() =>
      resolveOutputPath("/project", "../../evil.txt")
    ).toThrowError();
  });
});
