# abbrlink 项目发布流程指南

## 概述

本指南详细说明了 abbrlink 项目的 npm 发布流程，使用 release-it 配合 conventional-changelog 进行版本管理和自动化发布。

## 项目结构

这是一个使用 pnpm workspace 和 turbo 的 monorepo 项目，包含以下包：

- **abbrlink** - 核心 CLI 包
- **vite-plugin-abbrlink** - Vite 插件
- **eleventy-plugin-abbrlink** - Eleventy 插件
- **gatsby-plugin-abbrlink** - Gatsby 插件
- **hexo-plugin-abbrlink** - Hexo 插件
- **remix-plugin-abbrlink** - Remix 插件
- **sveltekit-plugin-abbrlink** - SvelteKit 插件
- **vuepress-plugin-abbrlink** - VuePress 插件

## 发布前准备

### 1. 确保代码已提交
```bash
git status
git add .
git commit -m "chore: prepare for release"
```

### 2. 运行测试
```bash
pnpm test
```

### 3. 构建项目
```bash
pnpm build
```

## 发布流程

### 一键发布所有包

在项目根目录运行：

```bash
pnpm release
```

这个命令会：
1. 使用 turbo 按照依赖顺序依次发布各个包（先发布核心包，再发布插件包）
2. 自动更新版本号
3. 生成 CHANGELOG.md
4. 创建 git tag
5. 推送到 GitHub
6. 创建 GitHub Release
7. 发布到 npm

### 单个包发布

如果只想发布特定的包，可以进入对应包目录运行：

```bash
cd packages/cli
pnpm release
```

## 版本管理

### 版本号规则

项目使用 [Semantic Versioning (语义化版本)](https://semver.org/)：

- **主版本 (Major)** - 不兼容的 API 修改
- **次版本 (Minor)** - 向下兼容的功能性新增
- **修订版本 (Patch)** - 向下兼容的问题修正

### 自动版本升级

release-it 会根据 commit message 自动确定版本升级类型：

| Commit 类型 | 版本升级 | 示例 |
|------------|---------|------|
| `feat:` | 次版本 (Minor) | `feat: add new feature` → 1.0.0 → 1.1.0 |
| `fix:` | 修订版本 (Patch) | `fix: resolve bug` → 1.0.0 → 1.0.1 |
| `BREAKING CHANGE:` | 主版本 (Major) | 包含 breaking change → 1.0.0 → 2.0.0 |

## Commit Message 规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (Type)

- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档更新
- `style` - 代码格式调整
- `refactor` - 重构
- `perf` - 性能优化
- `test` - 测试相关
- `build` - 构建系统
- `ci` - CI/CD 相关
- `chore` - 其他杂项

### 示例

```
feat(cli): add support for decimal representation

- Add 'rep' option to support hex/dec formats
- Update documentation

Closes #123
```

## 发布配置说明

### 共享配置

所有包使用位于 `configs/config-release-it/.release-it.js` 的共享配置，包含：

- **conventional-changelog** - 自动生成 CHANGELOG
- **bumper** - 更新 package.json 中的依赖版本
- **Git** - 自动提交、打标签、推送
- **GitHub** - 自动创建 Release
- **npm** - 自动发布到 npm 仓库

### 包特定配置

- 核心包 (`cli`) - 基础配置
- 插件包 - 额外配置，自动更新对核心包的依赖版本

## 发布前检查清单

- [ ] 所有代码已提交到 Git
- [ ] 所有测试通过 (`pnpm test`)
- [ ] 项目构建成功 (`pnpm build`)
- [ ] CHANGELOG 已正确生成
- [ ] npm 登录状态正常 (`npm whoami`)
- [ ] GitHub token 已配置（如需要）

## 常见问题

### Q: 如何取消发布？
A: 发布后 72 小时内可以使用 `npm unpublish <package>@<version>` 撤销，但不建议频繁使用。

### Q: 发布失败怎么办？
A: 
1. 检查 npm 登录状态：`npm whoami`
2. 确认包名未被占用
3. 检查网络连接
4. 查看错误日志，根据提示修复

### Q: 如何跳过某个包的发布？
A: 在该包的 package.json 中设置 `"private": true`，或在 .release-it.js 中设置 `npm.publish: false`。

### Q: 如何手动指定版本号？
A: 运行 `pnpm release -- <version>`，例如：`pnpm release -- 1.2.3`

## 相关资源

- [release-it 文档](https://github.com/release-it/release-it)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [turbo 文档](https://turbo.build/)
