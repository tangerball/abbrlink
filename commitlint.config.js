module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'perf',
        'test',
        'style',
        'chore',
        'release',
        'build',
        'ci',
        'docs',
        'revert',
      ],
    ],
  },
}
