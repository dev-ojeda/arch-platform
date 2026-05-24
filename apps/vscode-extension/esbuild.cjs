// apps/vscode-extension/esbuild.cjs

const esbuild = require('esbuild');

const fs = require('node:fs/promises');

const path = require('node:path');

const watch = process.argv.includes('--watch');

const appDir = __dirname;

const repoRoot = path.resolve(appDir, '../..');

const templatesSource = path.resolve(repoRoot, 'templates');

const templatesDestination = path.resolve(appDir, 'dist/templates');

async function copyTemplates() {
  await fs.rm(templatesDestination, {
    recursive: true,
    force: true,
  });

  await fs.cp(templatesSource, templatesDestination, {
    recursive: true,
  });
}

async function build() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],

    outfile: 'dist/extension.js',

    bundle: true,

    treeShaking: true,

    minify: false,

    sourcemap: true,

    legalComments: 'none',

    platform: 'node',

    target: 'node20',

    format: 'cjs',

    external: [
      'vscode',
      '@arch/contracts',
      '@arch/core',
      '@arch/application',
      '@arch/infrastructure',
      '@arch/generator-mvc',
    ],

    mainFields: ['module', 'main'],

    tsconfig: '../../tsconfig.base.json',

    logLevel: 'info',
  });

  if (watch) {
    await copyTemplates();

    await ctx.watch();

    console.log('[arch] watching...');

    return;
  }

  await copyTemplates();

  await ctx.rebuild();

  await ctx.dispose();
}

build().catch((err) => {
  console.error(err);

  process.exit(1);
});
