import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(new URL('./validate-branch-name.mjs', import.meta.url));

function validate(branchName) {
  return spawnSync(process.execPath, [scriptPath, branchName], {
    encoding: 'utf8',
  });
}

test('accepts every configured branch prefix', () => {
  for (const branch of [
    'feature/branch-naming-policy',
    'fix/git-feature-helper-safety',
    'chore/update-eslint',
    'test/branch-policy',
    'docs/branch-policy',
  ]) {
    const result = validate(branch);

    assert.equal(result.status, 0, `${branch}: ${result.stderr}`);
    assert.match(result.stdout, /\[OK\]/);
  }
});

test('rejects unsupported prefixes and missing prefixes', () => {
  for (const branch of [
    'my-new-feature',
    'refactor/build-runtime-bootstrap',
    'feature/',
    'feature/name/extra',
  ]) {
    const result = validate(branch);

    assert.equal(result.status, 1, `${branch} should be rejected`);
  }
});

test('rejects uppercase and invalid name separators', () => {
  for (const branch of [
    'feature/MyFeature',
    'feature/my_feature',
    'feature/-leading-hyphen',
    'feature/trailing-hyphen-',
  ]) {
    const result = validate(branch);

    assert.equal(result.status, 1, `${branch} should be rejected`);
  }
});
