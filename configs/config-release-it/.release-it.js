const version = '${version}'
const packageName = process.env.npm_package_name
const scope = packageName.split('/')[1]

module.exports = (path = []) => {
  return {
    plugins: {
      '@release-it/conventional-changelog': {
        path: '.',
        infile: 'CHANGELOG.md',
        header: '# Changelog',
        ignoreRecommendedBump: true,
        preset: {
          name: 'conventionalcommits',
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
              hidden: true,
            },
            {
              type: 'ci',
              section: '🔧 Continuous Integration | 持续集成',
              hidden: true,
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
      '@release-it/bumper': {
        out: {
          file: 'package.json',
          path,
        },
      },
    },
    git: {
      push: true,
      tagName: `${packageName}-v${version}`,
      commitsPath: '.',
      commitMessage: `feat(${scope || packageName}): released version v${version}`,
      requireCommits: true,
      requireCommitsFail: false,
    },
    npm: {
      publish: true,
      versionArgs: ['--workspaces false'],
    },
    github: {
      release: true,
      releaseName: `${packageName}-v${version}`,
    },
    hooks: {
      'after:bump': `echo ${packageName} 更新版本成功`,
    },
  }
}
