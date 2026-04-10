# abbrlink 项目 Code Wiki

## 1. 项目概述

abbrlink 是一个用于为 Markdown 文件生成唯一缩写链接的工具，支持多种技术栈。它能够自动为 Markdown 文件生成基于内容的唯一标识符，并将其添加到文件的 front matter 中，方便在各种静态网站生成器中使用。

### 主要功能特性

- 为 Markdown 文件生成唯一的缩写链接
- 支持多种技术栈：Vite、Astro、Next.js、Nuxt.js、Gatsby、Hexo、Eleventy、VuePress、SvelteKit、Remix
- 提供统一的配置格式
- 支持 CRC32 和 CRC16 算法
- 支持时区偏移配置
- 支持进制表示配置（十六进制/十进制）
- 支持自定义 front matter 字段名
- 支持草稿文件过滤
- 支持强制刷新模式
- 支持写回开关控制
- 支持文件排除规则
- 支持冲突检测与处理
- 自动检测文件变化并更新缩写链接

## 2. 项目架构

### 2.1 整体架构

abbrlink 采用 monorepo 架构，使用 pnpm workspace 管理多个包。核心功能实现位于 `packages/cli` 目录，各个技术栈的插件则作为独立的包存在。

```
├── packages/
│   ├── cli/              # 核心功能实现
│   ├── eleventy-plugin-abbrlink/  # Eleventy 插件
│   ├── gatsby-plugin-abbrlink/    # Gatsby 插件
│   ├── hexo-plugin-abbrlink/      # Hexo 插件
│   ├── remix-plugin-abbrlink/     # Remix 插件
│   ├── sveltekit-plugin-abbrlink/ # SvelteKit 插件
│   ├── vite-plugin-abbrlink/      # Vite 插件
│   ├── vuepress-plugin-abbrlink/  # VuePress 插件
├── docs/                 # 文档
├── configs/              # 配置文件
├── coverage/             # 测试覆盖率
├── package.json          # 根目录 package.json
├── pnpm-workspace.yaml   # pnpm workspace 配置
├── tsconfig.json         # TypeScript 配置
├── turbo.json            # Turbo 配置
└── vitest.config.ts      # Vitest 配置
```

### 2.2 核心模块关系

| 模块 | 职责 | 依赖关系 |
|------|------|----------|
| cli | 核心功能实现，提供统一的 API | crc, gray-matter, fast-glob, chokidar |
| eleventy-plugin-abbrlink | Eleventy 插件 | cli |
| gatsby-plugin-abbrlink | Gatsby 插件 | cli |
| hexo-plugin-abbrlink | Hexo 插件 | cli |
| remix-plugin-abbrlink | Remix 插件 | cli |
| sveltekit-plugin-abbrlink | SvelteKit 插件 | cli |
| vite-plugin-abbrlink | Vite 插件 | cli |
| vuepress-plugin-abbrlink | VuePress 插件 | cli |

## 3. 核心模块详解

### 3.1 CLI 核心模块

#### 3.1.1 主要功能

CLI 核心模块是整个项目的基础，提供了生成缩写链接的核心功能。它负责：

- 扫描配置的 Markdown 文件路径
- 解析 Markdown 文件的 front matter
- 生成唯一的缩写链接
- 处理冲突检测
- 更新文件的 front matter
- 监听文件变化并自动更新

#### 3.1.2 关键类与函数

##### AbbrLink 类

**位置**: [packages/cli/src/utils/abbrLink.ts](file:///workspace/packages/cli/src/utils/abbrLink.ts)

**功能**: 生成唯一的缩写链接，处理冲突检测

**主要方法**:

| 方法名 | 描述 | 参数 | 返回值 |
|--------|------|------|--------|
| `constructor` | 初始化 AbbrLink 实例 | `config` - 配置对象 | 无 |
| `getMdData` | 获取 Markdown 文件数据 | `path` - 文件路径 | `matter.GrayMatterFile<any>` |
| `hasAbbrLink` | 检查是否已有缩写链接 | `data` - front matter 数据 | `string` - 已有的缩写链接或空字符串 |
| `localDateTimeString` | 生成本地日期时间字符串 | `date` - 日期对象 | `string` - 格式化后的日期时间字符串 |
| `abbrLinkHelper` | 生成缩写链接 | `frontMatter` - front matter 数据 | `Promise<string>` - 生成的缩写链接 |
| `checkAndResolveConflict` | 检查并解决冲突 | `abbrlink` - 缩写链接<br>`filePath` - 文件路径 | `string` - 唯一的缩写链接 |
| `clearConflictSet` | 清除冲突检测集合 | 无 | 无 |
| `generateAbbrLink` | 生成缩写链接并更新 front matter | `value` - Markdown 文件数据<br>`filePath` - 文件路径 | `Promise<{ header: any; value: string }>` - 更新后的 header 和文件内容 |

##### createAbbrlink 函数

**位置**: [packages/cli/src/index.ts](file:///workspace/packages/cli/src/index.ts)

**功能**: 创建 abbrlink 实例，提供各种构建工具的插件接口

**参数**:
- `options` - 配置选项，包含路径、算法、表示格式等

**返回值**:
- 包含各种方法的对象，如 `initMdsSetAbbrLink`、`watchMdFiles`、`closeWatcher` 以及各种构建工具的插件方法

**主要方法**:

| 方法名 | 描述 | 参数 | 返回值 |
|--------|------|------|--------|
| `initMdsSetAbbrLink` | 初始化 Markdown 文件并设置缩写链接 | 无 | `Promise<void>` |
| `watchMdFiles` | 监听 Markdown 文件变化 | 无 | 无 |
| `closeWatcher` | 关闭文件监听器 | 无 | 无 |
| `setAbbrLink` | 为文件设置缩写链接 | `path` - 文件路径或路径数组 | `Promise<void>` |
| `getVitePlugin` | 获取 Vite 插件 | 无 | Vite 插件对象 |
| `getAstroIntegration` | 获取 Astro 集成 | 无 | Astro 集成对象 |
| `getNextjsPlugin` | 获取 Next.js 插件 | 无 | Next.js 插件对象 |
| `getNuxtModule` | 获取 Nuxt.js 模块 | 无 | Nuxt.js 模块对象 |
| `getGatsbyPlugin` | 获取 Gatsby 插件 | 无 | Gatsby 插件对象 |
| `getHexoPlugin` | 获取 Hexo 插件 | 无 | Hexo 插件对象 |
| `getEleventyPlugin` | 获取 Eleventy 插件 | 无 | Eleventy 插件对象 |
| `getVuePressPlugin` | 获取 VuePress 插件 | 无 | VuePress 插件对象 |
| `getSvelteKitPlugin` | 获取 SvelteKit 插件 | 无 | SvelteKit 插件对象 |
| `getRemixPlugin` | 获取 Remix 插件 | 无 | Remix 插件对象 |

### 3.2 插件模块

各插件模块的结构相似，都是对核心功能的封装，适配不同的构建工具。以下是几个主要插件的实现：

#### 3.2.1 Vite 插件

**位置**: [packages/vite-plugin-abbrlink/src/index.ts](file:///workspace/packages/vite-plugin-abbrlink/src/index.ts)

**功能**: 为 Vite 项目提供 abbrlink 功能

**实现**: 调用核心模块的 `getVitePlugin` 方法获取 Vite 插件对象

#### 3.2.2 Gatsby 插件

**位置**: [packages/gatsby-plugin-abbrlink/src/index.ts](file:///workspace/packages/gatsby-plugin-abbrlink/src/index.ts)

**功能**: 为 Gatsby 项目提供 abbrlink 功能

**实现**: 调用核心模块的 `getGatsbyPlugin` 方法获取 Gatsby 插件对象

#### 3.2.3 Hexo 插件

**位置**: [packages/hexo-plugin-abbrlink/src/index.ts](file:///workspace/packages/hexo-plugin-abbrlink/src/index.ts)

**功能**: 为 Hexo 项目提供 abbrlink 功能

**实现**: 调用核心模块的 `getHexoPlugin` 方法获取 Hexo 插件对象

## 4. 数据结构

### 4.1 配置结构

#### Options 接口

**位置**: [packages/cli/src/model/config.ts](file:///workspace/packages/cli/src/model/config.ts)

```typescript
export interface Options extends AbbrLinkConfig {
  /**
   * @description: Paths to Markdown files to process
   * @description Supports glob patterns, can be a single string or an array of strings
   */
  paths: string | string[]

  /**
   * @description: Whether to process draft files
   * @default false
   * @description If true, draft files will also be processed; if false, draft files are skipped
   */
  drafts?: boolean

  /**
   * @description: Force mode - regenerate abbrlink even if it already exists
   * @default false
   * @description When true, ignores existing abbrlink values and recalculates for all files
   */
  force?: boolean

  /**
   * @description: Whether to write changes back to the actual Markdown files
   * @default true
   * @description When false, abbrlink is only generated in memory without modifying source files
   */
  writeback?: boolean

  /**
   * @description: File patterns to exclude from processing
   * @description Supports glob patterns, can be a single string or an array of strings
   */
  exclude?: string | string[]
}
```

#### AbbrLinkConfig 接口

**位置**: [packages/cli/src/model/abbrLink.ts](file:///workspace/packages/cli/src/model/abbrLink.ts)

```typescript
export interface AbbrLinkConfig {
  /**
   * @description:  Algorithm used to generate abbrlink
   * @default 'crc32'
   */
  alg: 'crc32' | 'crc16'

  /**
   * @description:  Representation format of abbrlink
   * @default 'hex'
   * @description 'hex' for hexadecimal (e.g., a1b2c3d4), 'dec' for decimal (e.g., 123456789)
   */
  rep?: 'hex' | 'dec'

  /**
   * @description:  Time zone offset in hours
   * @default 8
   */
  timeOffsetInHours?: number

  /**
   * @description:  Custom field name in front matter
   * @default 'abbrlink'
   * @description Allows using a custom field name instead of 'abbrlink' in the front matter
   */
  fieldName?: string
}
```

### 4.2 FrontMatter 接口

**位置**: [packages/cli/src/model/abbrLink.ts](file:///workspace/packages/cli/src/model/abbrLink.ts)

```typescript
export interface FrontMatter {
  /**
   * @description:  Title of the article
   */
  title: string
  /**
   * @description:  Date of the article
   */
  date: Date
  [k: string]: any
}
```

## 5. 工作流程

### 5.1 初始化流程

1. 调用 `createAbbrlink` 函数创建 abbrlink 实例
2. 配置路径、算法、表示格式等选项
3. 调用 `initMdsSetAbbrLink` 方法初始化 Markdown 文件
4. `initMdsSetAbbrLink` 方法调用 `getFileMds` 获取所有 Markdown 文件路径
5. 对每个文件调用 `setAbbrLink` 方法设置缩写链接
6. `setAbbrLink` 方法调用 `abbrLink.getMdData` 获取文件数据
7. 检查是否为草稿文件，如果是且 `drafts` 选项为 false，则跳过
8. 检查是否需要处理（force 模式或没有 abbrlink）
9. 调用 `abbrLink.generateAbbrLink` 生成缩写链接
10. 如果 `writeback` 选项为 true，则将更改写回文件

### 5.2 监听流程

1. 调用 `watchMdFiles` 方法开始监听文件变化
2. 使用 chokidar 监听配置的路径
3. 当文件变化时，调用 `setAbbrLink` 方法更新缩写链接
4. 调用 `closeWatcher` 方法关闭监听器

### 5.3 冲突处理流程

1. 在 `generateAbbrLink` 方法中生成缩写链接
2. 调用 `checkAndResolveConflict` 方法检查是否有冲突
3. 如果有冲突，生成带后缀的缩写链接（如 `a1b2c3d4-2`）
4. 将唯一的缩写链接添加到冲突检测集合中

## 6. 技术栈与依赖

| 技术/依赖 | 用途 | 版本 |
|-----------|------|------|
| TypeScript | 开发语言 | ^5.4.5 |
| crc | 生成 CRC 校验和 | - |
| gray-matter | 解析 Markdown front matter | - |
| fast-glob | 查找文件 | - |
| chokidar | 监听文件变化 | - |
| turbo | 构建工具 | ^1.13.3 |
| unbuild | 构建工具 | ^2.0.0 |
| vitest | 测试框架 | ^2.1.3 |
| eslint | 代码检查 | ^9.2.0 |
| prettier | 代码格式化 | ^3.2.5 |
| release-it | 发布工具 | ^17.2.1 |

## 7. 安装与使用

### 7.1 核心包安装

```bash
npm install abbrlink
```

### 7.2 技术栈插件安装

根据使用的技术栈，安装对应的插件：

```bash
# Vite
npm install vite-plugin-abbrlink

# Astro
npm install abbrlink

# Next.js
npm install abbrlink

# Nuxt.js
npm install abbrlink

# Gatsby
npm install gatsby-plugin-abbrlink

# Hexo
npm install hexo-plugin-abbrlink

# Eleventy
npm install eleventy-plugin-abbrlink

# VuePress
npm install vuepress-plugin-abbrlink

# SvelteKit
npm install sveltekit-plugin-abbrlink

# Remix
npm install remix-plugin-abbrlink
```

### 7.3 核心包使用

```javascript
import createAbbrlink from 'abbrlink'

const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  alg: 'crc32',
  rep: 'hex',
  timeOffsetInHours: 8,
  fieldName: 'abbrlink',
  drafts: false,
  force: false,
  writeback: true,
  exclude: ['**/README.md', '**/drafts/**']
})

// 初始化并设置所有 Markdown 文件的缩写链接
await abbrlink.initMdsSetAbbrLink()

// 监听文件变化
abbrlink.watchMdFiles()

// 关闭监听器
// abbrlink.closeWatcher()
```

### 7.4 Vite 插件使用

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vitePluginAbbrlink from 'vite-plugin-abbrlink'

export default defineConfig({
  plugins: [
    vitePluginAbbrlink({
      paths: 'src/**/*.md',
      alg: 'crc32',
      rep: 'hex',
      timeOffsetInHours: 8,
      fieldName: 'abbrlink',
      drafts: false,
      force: false,
      writeback: true,
      exclude: ['**/README.md']
    })
  ]
})
```

## 8. 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `paths` | string \| string[] | - | 需要处理的 Markdown 文件路径（支持 glob 模式） |
| `alg` | string | 'crc32' | 生成 abbrlink 的算法（可选值：'crc32'、'crc16'） |
| `rep` | string | 'hex' | abbrlink 的表示格式（可选值：'hex'、'dec'） |
| `timeOffsetInHours` | number | 8 | 时区偏移量（小时） |
| `fieldName` | string | 'abbrlink' | front matter 中的字段名 |
| `drafts` | boolean | false | 是否处理草稿文件 |
| `force` | boolean | false | 强制模式，忽略已存在的 abbrlink 并重新生成 |
| `writeback` | boolean | true | 是否将更改写回实际的 Markdown 文件 |
| `exclude` | string \| string[] | - | 要排除处理的文件模式（支持 glob） |

## 9. 示例

### 9.1 输入

```markdown
---
title: Hello World
date: 2023-01-01
---

Hello World!
```

### 9.2 输出（默认配置）

```markdown
---
title: Hello World
date: 2023-01-01
abbrlink: a1b2c3d4
---

Hello World!
```

### 9.3 输出（使用十进制格式）

```markdown
---
title: Hello World
date: 2023-01-01
abbrlink: 1690090958
---

Hello World!
```

### 9.4 输出（使用自定义字段名）

```markdown
---
title: Hello World
date: 2023-01-01
shortId: a1b2c3d4
---

Hello World!
```

## 10. 常见问题

### 10.1 生成的 abbrlink 是什么格式？

默认生成的 abbrlink 是基于 CRC 算法的十六进制字符串，例如 `a1b2c3d4`。您也可以通过 `rep` 配置选择十进制格式，例如 `1690090958`。

### 10.2 abbrlink 是如何保证唯一性的？

abbrlink 基于文件的标题和日期生成，确保在相同输入下生成相同的结果，不同输入下生成不同的结果。同时，插件会检测 abbrlink 冲突并自动处理，确保生成的链接唯一。

### 10.3 可以自定义 abbrlink 的长度吗？

目前不支持自定义长度，长度由选择的算法决定（CRC32 生成 8 位，CRC16 生成 4 位）。

### 10.4 如何在模板中使用 abbrlink？

您可以在模板中通过 front matter 访问 abbrlink，例如：

```jsx
// React 示例
{frontmatter.abbrlink}

// Vue 示例
{{ frontmatter.abbrlink }}

// 自定义字段名示例
{frontmatter.shortId}
```

### 10.5 如何识别草稿文件？

插件会通过以下方式识别草稿文件：
- 文件路径包含 `drafts/` 或 `_drafts/` 目录
- 文件名以下划线 `_` 开头
- front matter 中包含 `draft: true` 字段

### 10.6 如何处理 abbrlink 冲突？

当检测到 abbrlink 冲突时，插件会：
1. 发出警告日志，提示冲突的文件和 abbrlink 值
2. 自动重新生成一个带后缀的 abbrlink（例如：`a1b2c3d4-2`）
3. 确保最终生成的 abbrlink 唯一

## 11. 开发与测试

### 11.1 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# 代码格式化
pnpm format

# 发布
pnpm release
```

### 11.2 测试

项目使用 Vitest 进行测试，测试文件位于各个包的 `src` 目录下，命名为 `*.test.ts`。

## 12. 许可证

MIT
