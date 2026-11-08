// config/eslint/rules/architecture.mjs

export const NO_BARREL_STAR_EXPORT_RULE = {
  // 🔒 Gobernanza Global: Prohíbe cualquier forma de "export *" en todo el monorepo
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ExportAllDeclaration',
      message:
        "❌ [Gobernanza Arch-Platform]: Prohibido usar 'export *' en el monorrepo. Expón tus módulos de forma explícita mediante Exports Nombrados (e.g., export { MiModulo } from './modulo.js') para blindar el monorrepo contra colisiones estáticas.",
    },
  ],
};

export const ARCHITECTURE_RULES = {
  'import-x/no-commonjs': 'error',
  ...NO_BARREL_STAR_EXPORT_RULE,
};

export const ARCHITECTURE_RULES_NO_COMMONJS = {
  'import-x/no-commonjs': 'off',
  ...NO_BARREL_STAR_EXPORT_RULE,
};

export const ARCHITECTURE_RULES_NO_REQUIRED = {
  '@typescript-eslint/no-require-imports': 'off',
  ...ARCHITECTURE_RULES_NO_COMMONJS,
};
