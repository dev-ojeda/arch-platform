// packages/application/src/generation/engine/__tests__/create-mock-filesystem.test.ts

import { describe, expect, it } from "vitest";

import { createMockFilesystem } from "@arch/testing";

describe("createMockFilesystem", () => {
  it("writes and reads files", async () => {
    const filesystem = createMockFilesystem();
    await filesystem.write("src/example.ts", "export const value = 1;");

    const content = await filesystem.read("src/example.ts");
    console.debug("content", content);
    expect(content).toBe("export const value = 1;");

    expect(filesystem.state.files.get("src/example.ts")).toBe(
      "export const value = 1;"
    );
  });

  it("checks file existence", async () => {
    const filesystem = createMockFilesystem();
    await filesystem.write("README.md", "# test");

    await expect(filesystem.exists("README.md")).resolves.toBe(true);

    await expect(filesystem.exists("missing.md")).resolves.toBe(false);
  });

  it("copies files", async () => {
    const filesystem = createMockFilesystem();

    await filesystem.write(
      "source.txt",

      "hello world"
    );

    await filesystem.copy(
      "source.txt",

      "target.txt"
    );

    expect(await filesystem.read("target.txt")).toBe("hello world");
  });

  it("creates directories", async () => {
    const filesystem = createMockFilesystem();

    await filesystem.createDirectory("src/services");

    expect(filesystem.state.directories.has("src/services")).toBe(true);
  });

  it("removes files", async () => {
    const filesystem = createMockFilesystem();

    await filesystem.write(
      "temp.txt",

      "temporary file"
    );

    await filesystem.remove("temp.txt");

    await expect(filesystem.exists("temp.txt")).resolves.toBe(false);
  });

  it("reads directory entries", async () => {
    const filesystem = createMockFilesystem();

    await filesystem.write(
      "src/a.ts",

      "a"
    );

    await filesystem.write(
      "src/b.ts",

      "b"
    );

    const entries = await filesystem.readDirectory("src");

    expect(entries).toHaveLength(2);

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "src/a.ts",
        }),

        expect.objectContaining({
          path: "src/b.ts",
        }),
      ])
    );
  });
});
