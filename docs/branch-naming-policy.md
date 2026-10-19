# Branch Naming Policy

## Convention

All working branches must follow this format:

`<type>/<description>`

The description must use **kebab-case**: lowercase letters, numbers, and hyphens separating words.

## Allowed prefixes

| Prefix     | Purpose               | Example                         |
| ---------- | --------------------- | ------------------------------- |
| `feature/` | New capabilities      | `feature/branch-naming-policy`  |
| `fix/`     | Bug fixes             | `fix/git-feature-helper-safety` |
| `chore/`   | Maintenance tasks     | `chore/update-eslint`           |
| `test/`    | Testing changes       | `test/branch-policy`            |
| `docs/`    | Documentation changes | `docs/branch-policy`            |

## Naming rules

- Use one of the allowed prefixes.
- Use lowercase letters and numbers.
- Separate words with single hyphens.
- Do not use underscores or additional `/` separators.
- Do not leave the description empty.

### Examples

Valid:

- `feature/branch-naming-policy`
- `fix/git-feature-helper-safety`
- `docs/branch-policy`

Invalid:

- `my-new-feature` — missing prefix.
- `refactor/build-runtime-bootstrap` — unsupported prefix.
- `feature/Branch-Policy` — uppercase letters.
- `feature/branch_policy` — underscores.
- `feature/name/extra` — additional separator.

## Enforcement

Branch names are validated by `scripts/git/validate-branch-name.mjs`, using the centralized configuration in `config/git-branch-policy.json`.

The policy is enforced locally by `scripts/git/feature.bat` and checked by GitHub Actions for pull requests targeting `dev`.

The GitHub check must be configured as a required status check in the repository's branch protection rules or ruleset if it is to block merges.

## Validation

Run the automated tests with:

```bash
node --test scripts/git/validate-branch-name.test.mjs
```
