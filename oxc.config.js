export default {
  lint: {
    rules: {
      // 基本规则
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-empty': 'error',
      'no-extra-semi': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'space-infix-ops': 'error',
      'space-before-function-paren': ['error', 'always'],
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      'brace-style': ['error', '1tbs'],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
      'no-whitespace-before-property': 'error',
      'no-console': 'warn'
    }
  },
  format: {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    arrowParens: 'always'
  }
}