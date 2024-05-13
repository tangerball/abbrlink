const version = '${version}'
const packageName = process.env.npm_package_name
const scope = packageName.split('/')[1]

module.exports = {
  plugins: {
    '@release-it/conventional-changelog': {
      path: '.',
      infile: 'CHANGELOG.md',
      preset: {
        name: 'conventionalcommits',
        header: '# Changelog',
        types: [
          {
            type: 'feat',
            section: '✨ Features | 新功能',
          },
          {
            type: 'fix',
            section: '🐛 Bug Fixes | Bug 修复',
          },
          {
            type: 'perf',
            section: '⚡ Performance Improvements | 性能优化',
          },
          {
            type: 'revert',
            section: '⏪ Reverts | 回退',
          },
          {
            type: 'docs',
            section: '📚 Documentation | 文档',
          },
          {
            type: 'style',
            section: '💅 Styles | 样式',
          },
          {
            type: 'refactor',
            section: '♻ Code Refactoring | 代码重构',
          },
          {
            type: 'test',
            section: '🔬 Tests | 测试',
          },
          {
            type: 'build',
            section: '👷‍♂️ Build System | 构建系统',
          },
          {
            type: 'ci',
            section: '🔧 Continuous Integration | 持续集成',
          },
          {
            type: 'chore',
            section: '🧹 Chores | 其他更新',
          },
          {
            type: 'other',
            hidden: true,
          },
        ],
      },
      gitRawCommitsOpts: {
        path: '.',
      },
    },
  },
  git: {
    push: true,
    tagName: `${packageName}-v${version}`,
    // pushRepo: 'git@github.com:tangerball/vite-plugin-abbrlink.git',
    commitsPath: '.',
    commitMessage: `feat(${scope || packageName}): released version v${version}`,
    // requireCommits: true,
    // requireCommitsFail: false,
  },
  npm: {
    publish: false,
    versionArgs: ['--workspaces false'],
  },
  github: {
    release: true,
    releaseName: `${packageName}-v${version}`,
  },
  hooks: {
    'before:git:release': ['git add --all'],
  },
}
