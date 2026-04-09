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

### 1. 获取并配置访问令牌

#### npm Access Token
1. 访问 https://www.npmjs.com/settings/tokens
2. 点击 "Generate New Token" → "Granular Access Token"
3. 配置权限，确保有发布权限
4. 复制生成的 token

配置 npm token：
```bash
# 方式1：使用 npm login（推荐）
npm login

# 方式2：直接配置 token（不推荐提交到仓库）
echo "//registry.npmjs.org/:_authToken=你的npm_token" > ~/.npmrc
```

#### GitHub Personal Access Token
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置 Note（例如：`abbrlink-release`）
4. 设置 Expiration（建议选择 No expiration 或较长时间）
5. 选择权限范围，勾选：
   - `repo` - 完整的仓库访问权限
   - `write:packages` - 写入包权限（如需要）
   - `read:packages` - 读取包权限（如需要）
6. 点击 "Generate token"
7. **重要**：立即复制并保存 token，只显示一次！

配置 GitHub token：
```bash
# 设置环境变量
export GITHUB_TOKEN="你的GitHub_token"

# 或者在命令中直接使用
GITHUB_TOKEN="你的GitHub_token" pnpm release
```

### 2. 确保代码已提交
```bash
git status
git add .
git commit -m "chore: prepare for release"
```

### 3. 运行测试
```bash
pnpm test
```

### 4. 构建项目
```bash
pnpm build
```

## 发布流程

### 方式一：使用 release-it 自动化发布（推荐）

#### 一键发布所有包

在项目根目录运行：

```bash
# 确保已设置 GITHUB_TOKEN
export GITHUB_TOKEN="你的GitHub_token"
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

#### 单个包发布

如果只想发布特定的包，可以进入对应包目录运行：

```bash
cd packages/cli
pnpm release
```

### 方式二：手动分步发布（如果自动化有问题）

#### 步骤1：发布 npm 包

```bash
# 先发布核心包
cd packages/cli
npm publish --tag latest

# 再发布插件包（按依赖顺序）
cd ../vite-plugin-abbrlink
npm publish --tag latest

cd ../hexo-plugin-abbrlink
npm publish --tag latest

# ... 其他包
```

#### 步骤2：创建 Git 标签

```bash
# 为每个包创建标签
git tag -a abbrlink-v1.0.2 -m "abbrlink v1.0.2"
git tag -a vite-plugin-abbrlink-v1.0.2 -m "vite-plugin-abbrlink v1.0.2"
git tag -a hexo-plugin-abbrlink-v1.0.0 -m "hexo-plugin-abbrlink v1.0.0"
# ... 其他包

# 推送标签到 GitHub
git push origin --tags
```

#### 步骤3：创建 GitHub Releases

使用 GitHub API 创建 Release：

```bash
# 示例：为 abbrlink-v1.0.2 创建 Release
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tag_name": "abbrlink-v1.0.2",
    "name": "abbrlink-v1.0.2",
    "body": "你的Release说明（从CHANGELOG.md复制）",
    "draft": false,
    "prerelease": false
  }' \
  https://api.github.com/repos/tangerball/abbrlink/releases
```

或者直接在 GitHub 网页界面手动创建：
1. 访问 https://github.com/tangerball/abbrlink/releases
2. 点击 "Draft a new release"
3. 选择对应的 tag
4. 填写 Release 标题和说明
5. 点击 "Publish release"

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

- [ ] npm Access Token 已获取并配置
- [ ] GitHub Personal Access Token 已获取并配置
- [ ] 所有代码已提交到 Git
- [ ] 所有测试通过 (`pnpm test`)
- [ ] 项目构建成功 (`pnpm build`)
- [ ] npm 登录状态正常 (`npm whoami`)
- [ ] 环境变量已设置（如需要）

## 常见问题

### Q: 如何取消发布？
A: 发布后 72 小时内可以使用 `npm unpublish <package>@<version>` 撤销，但不建议频繁使用。

### Q: 发布失败怎么办？
A: 
1. 检查 npm 登录状态：`npm whoami`
2. 确认包名未被占用
3. 检查网络连接
4. 查看错误日志，根据提示修复
5. 如果 release-it 有问题，尝试手动分步发布

### Q: 如何跳过某个包的发布？
A: 在该包的 package.json 中设置 `"private": true`，或在 .release-it.js 中设置 `npm.publish: false`。

### Q: 如何手动指定版本号？
A: 运行 `pnpm release -- <version>`，例如：`pnpm release -- 1.2.3`

### Q: GitHub Release 没有自动创建怎么办？
A: 
1. 确认 `GITHUB_TOKEN` 环境变量已正确设置
2. 确认 token 有 `repo` 权限
3. 尝试手动创建 GitHub Release（参考方式二的步骤3）

### Q: 如何查看已发布的包？
A: 
```bash
# 查看特定包的版本
npm view abbrlink version

# 查看所有版本
npm view abbrlink versions
```

## 相关资源

- [release-it 文档](https://github.com/release-it/release-it)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [turbo 文档](https://turbo.build/)
- [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [npm Creating and viewing access tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens)
