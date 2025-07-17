module.exports = {
  extends: ['./eslint.config.js'],
  rules: {
    // Disable non-critical rules for production
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error', // Keep this as error - it's critical
    'no-prototype-builtins': 'warn',
    'no-useless-escape': 'warn',
    'no-case-declarations': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-empty-object-type': 'warn',
    'react-refresh/only-export-components': 'warn',
    'prefer-const': 'warn'
  }
};
