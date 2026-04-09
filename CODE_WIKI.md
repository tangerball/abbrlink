# abbrlink 项目文档

## 1. 项目概述

abbrlink 是一个用于为 Markdown 文件添加 abbrlink 属性的工具，根据 [hexo-abbrlink](https://github.com/Rozbo/hexo-abbrlink) 的功能逻辑实现。该工具可以为 Markdown 文件生成唯一的缩写链接，适用于静态网站生成器如 Astro 和 VitePress。

### 主要功能
- 为 Markdown 文件自动生成唯一的 abbrlink 属性
- 支持 crc16 和 crc32 两种算法生成链接
- 监控 Markdown 文件变化并自动更新 abbrlink
- 提供 Vite 插件集成

## 2. 项目架构

### 2.1 项目结构

```
/Users/tangerball/codeBase/abbrlink/
├── .husky/                # Git 钩子配置
├── .vscode/               # VS Code 配置
├── configs/               # 配置文件
│   └── config-release-it/ # release-it 配置
├── packages/              # 项目包
│   ├── cli/               # 核心功能包
│   │   ├── src/           # 源代码
│   │   │   ├── model/     # 类型定义
│   │   │   ├── utils/     # 工具类
│   │   │   └── index.ts   # 主入口
│   │   └── package.json   # CLI 包配置
│   └── vite-plugin-abbrlink/ # Vite 插件包
│       ├── src/           # 源代码
│       │   └── index.ts   # 插件入口
│       └── package.json   # 插件配置
├── package.json           # 根项目配置
└── pnpm-workspace.yaml    # pnpm 工作区配置
```

### 2.2 模块关系

| 模块 | 职责 | 依赖关系 |
|------|------|----------|
| cli | 核心功能实现，提供 abbrlink 生成和文件监控 | chokidar, crc, fast-glob, gray-matter |
| vite-plugin-abbrlink | Vite 插件集成 | vite, abbrlink (cli 包) |

## 3. 核心模块详解

### 3.1 CLI 包

#### 3.1.1 主入口文件 (`packages/cli/src/index.ts`)

主入口文件提供了以下核心功能：
- 初始化配置并创建 AbbrLink 实例
- 提供 `initMdsSetAbbrLink` 函数，用于初始化 Markdown 文件并设置 abbrlink
- 提供 `watchMdFiles` 函数，用于监控 Markdown 文件变化
- 提供 `closeWatcher` 函数，用于关闭文件监控
- 提供 `setAbbrLink` 函数，用于为指定路径的文件设置 abbrlink
- 提供 `getVitePlugin` 函数，用于获取 Vite 插件
- 提供 `getAstroIntegration` 函数，用于获取 Astro 集成
- 提供 `getNextjsPlugin` 函数，用于获取 Next.js 插件
- 提供 `getNuxtModule` 函数，用于获取 Nuxt.js 模块

**关键函数**：
- `getFileMds`: 获取指定路径下的 Markdown 文件
- `updateFileContent`: 更新 Markdown 文件内容
- `setAbbrLink`: 为文件设置 abbrlink
- `initMdsSetAbbrLink`: 初始化所有 Markdown 文件
- `watchMdFiles`: 监控文件变化
- `closeWatcher`: 关闭监控
- `getVitePlugin`: 获取 Vite 插件
- `getAstroIntegration`: 获取 Astro 集成
- `getNextjsPlugin`: 获取 Next.js 插件
- `getNuxtModule`: 获取 Nuxt.js 模块

#### 3.1.2 AbbrLink 工具类 (`packages/cli/src/utils/abbrLink.ts`)

AbbrLink 类是核心功能实现，负责生成和管理 abbrlink：

**核心方法**：
- `getMdData`: 读取 Markdown 文件数据
- `hasAbbrLink`: 检查文件是否已有 abbrlink
- `localDateTimeString`: 生成本地日期时间字符串
- `abbrLinkHelper`: 生成唯一的 abbrlink
- `generateAbbrLink`: 生成 abbrlink 并更新文件内容

**算法实现**：
- 支持 crc16 和 crc32 两种算法
- 使用文章标题和日期时间生成唯一哈希值

### 3.2 Vite 插件包

#### 3.2.1 插件入口文件 (`packages/vite-plugin-abbrlink/src/index.ts`)

Vite 插件集成了 abbrlink 功能，在 Vite 构建过程中自动处理 Markdown 文件：

**插件钩子**：
- `buildStart`: 构建开始时初始化 Markdown 文件
- `configResolved`: 配置解析完成后开始监控文件变化
- `closeBundle`: 构建完成后关闭文件监控

### 3.3 多技术栈支持

abbrlink 现在支持多种技术栈：

**Vite**：通过 `vite-plugin-abbrlink` 插件或 `getVitePlugin` 方法
**Astro**：通过 `getAstroIntegration` 方法
**Next.js**：通过 `getNextjsPlugin` 方法
**Nuxt.js**：通过 `getNuxtModule` 方法

## 4. 关键类与函数

### 4.1 AbbrLink 类

**构造函数**：
```typescript
constructor(config: Partial<{ alg: AbbrLinkConfig['alg']; timeOffsetInHours: number }> = {})
```
- `config`: 配置对象，包含算法选择和时区偏移
- 默认算法：crc32
- 默认时区偏移：8小时

**核心方法**：

| 方法名 | 描述 | 参数 | 返回值 |
|--------|------|------|--------|
| `getMdData` | 读取 Markdown 文件数据 | `path: string` - 文件路径 | `Promise<matter.GrayMatterFile<any>>` - 文件数据 |
| `hasAbbrLink` | 检查文件是否已有 abbrlink | `data: any` - 文件数据 | `string` - 已有 abbrlink 或空字符串 |
| `localDateTimeString` | 生成本地日期时间字符串 | `date: Date` - 日期对象 | `string` - 格式化的日期时间字符串 |
| `abbrLinkHelper` | 生成唯一的 abbrlink | `frontMatter: FrontMatter` - 文章前 Matter | `Promise<string>` - 生成的 abbrlink |
| `generateAbbrLink` | 生成 abbrlink 并更新文件内容 | `value: matter.GrayMatterFile<any>` - 文件数据 | `Promise<{ header: any; value: string }>` - 更新后的文件数据 |

### 4.2 主入口函数

**函数签名**：
```typescript
export default function createAbbrlink(options: Options) {
  // 实现...
  return {
    initMdsSetAbbrLink,
    watchMdFiles,
    closeWatcher,
    setAbbrLink,
    getVitePlugin,
    getAstroIntegration,
    getNextjsPlugin,
    getNuxtModule,
  }
}
```

**参数**：
- `options`: 配置对象，包含 `paths`、`alg` 和 `timeOffsetInHours` 等选项

**返回值**：
- `initMdsSetAbbrLink`: 初始化 Markdown 文件并设置 abbrlink
- `watchMdFiles`: 监控 Markdown 文件变化
- `closeWatcher`: 关闭文件监控
- `setAbbrLink`: 为指定路径的文件设置 abbrlink
- `getVitePlugin`: 获取 Vite 插件
- `getAstroIntegration`: 获取 Astro 集成
- `getNextjsPlugin`: 获取 Next.js 插件
- `getNuxtModule`: 获取 Nuxt.js 模块

### 4.3 Vite 插件函数

**函数签名**：
```typescript
export default function vitePluginAbbrLink(options: Options) {
  // 实现...
  return {
    name: 'vite-plugin-abbrLink',
    async buildStart() { /* ... */ },
    async configResolved() { /* ... */ },
    closeBundle() { /* ... */ },
  }
}
```

**参数**：
- `options`: 与主入口函数相同的配置选项

**返回值**：
- Vite 插件对象，包含构建钩子

## 5. 类型定义

### 5.1 AbbrLinkConfig 接口

**定义**：
```typescript
export interface AbbrLinkConfig {
  /**
   * @description:  Algorithm
   * @default 'crc32'
   */
  alg: 'crc32' | 'crc16'
}
```

**说明**：
- `alg`: 生成 abbrlink 的算法，支持 'crc32' 和 'crc16' 两种选项

### 5.2 FrontMatter 接口

**定义**：
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

**说明**：
- `title`: 文章标题
- `date`: 文章日期
- `[k: string]: any`: 其他任意字段

### 5.3 Options 接口

**定义**：
```typescript
export interface Options extends AbbrLinkConfig {
  /**
   * @description: The file of the article
   */
  paths: string | string[]
}
```

**说明**：
- `paths`: Markdown 文件路径，支持字符串或字符串数组
- 继承自 `AbbrLinkConfig`，包含 `alg` 选项

## 6. 依赖关系

### 6.1 根项目依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| turbo | ^1.13.3 | 构建工具 |
| unbuild | ^2.0.0 | 打包工具 |

### 6.2 CLI 包依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| chokidar | ^3.6.0 | 文件系统监控 |
| crc | ^4.3.2 | 生成哈希值 |
| fast-glob | ^3.3.2 | 文件路径匹配 |
| gray-matter | ^4.0.3 | 解析 Markdown frontmatter |

### 6.3 Vite 插件包依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| vite | ^5.2.11 | Vite 核心 |
| abbrlink | 1.0.1 | 核心功能包 |

## 7. 项目运行方式

### 7.1 作为库使用

**安装**：
```bash
pnpm add abbrlink -D
```

**使用示例**：
```typescript
import createAbbrlink from 'abbrlink'
const abbrlinkInstance = createAbbrlink(options)

// 初始化 Markdown 文件并设置缩写链接
await abbrlinkInstance.initMdsSetAbbrLink()

// 监控 Markdown 文件并写入 abbrlink 字段
abbrlinkInstance.watchMdFiles()

// 当终端关闭时，可调用监控函数
abbrlinkInstance.closeWatcher()
```

### 7.2 作为 Vite 插件使用

**安装**：
```bash
pnpm add abbrlink vite-plugin-abbrlink -D
```

**使用示例**：
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vitePluginAbbrLink from 'vite-plugin-abbrlink'

export default defineConfig({
  plugins: [
    vitePluginAbbrLink({
      paths: 'src/content/**/*.md',
      alg: 'crc32'
    })
  ]
})
```

### 7.3 作为 Astro 集成使用

**安装**：
```bash
pnpm add abbrlink -D
```

**使用示例**：
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import createAbbrlink from 'abbrlink'

const { getAstroIntegration } = createAbbrlink({
  paths: 'src/content/**/*.md',
  alg: 'crc32'
})

export default defineConfig({
  integrations: [
    getAstroIntegration()
  ]
})
```

### 7.4 作为 Next.js 插件使用

**安装**：
```bash
pnpm add abbrlink -D
```

**使用示例**：
```typescript
// next.config.js
const createAbbrlink = require('abbrlink')

const { getNextjsPlugin } = createAbbrlink({
  paths: 'pages/**/*.md',
  alg: 'crc32'
})

module.exports = {
  webpack: (config) => {
    config.plugins.push(getNextjsPlugin())
    return config
  }
}
```

### 7.5 作为 Nuxt.js 模块使用

**安装**：
```bash
pnpm add abbrlink -D
```

**使用示例**：
```typescript
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'
import createAbbrlink from 'abbrlink'

const { getNuxtModule } = createAbbrlink({
  paths: 'content/**/*.md',
  alg: 'crc32'
})

export default defineNuxtConfig({
  modules: [
    getNuxtModule()
  ]
})
```

## 8. 配置选项

### 8.1 核心配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `paths` | `string \| string[]` | `[]` | Markdown 文件路径，支持 glob 模式 |
| `alg` | `'crc32' \| 'crc16'` | `'crc32'` | 生成 abbrlink 的算法 |
| `timeOffsetInHours` | `number` | `8` | 时区偏移小时数 |

### 8.2 示例配置

**生成 crc16 链接**：
```typescript
abbrlink({
  paths: 'src/posts/**/*.md',
  alg: 'crc16'
})
```

**生成 crc32 链接**：
```typescript
abbrlink({
  paths: 'src/content/**/*.md',
  alg: 'crc32'
})
```

## 9. 生成的链接示例

### 9.1 crc16 算法

```
https://tangerball.com/posts/66c8
```

### 9.2 crc32 算法

```
https://tangerball.com/posts/8ddf18fb
```

## 10. 项目构建与发布

### 10.1 构建命令

```bash
pnpm build
```

### 10.2 发布命令

```bash
pnpm release
```

## 11. 总结

abbrlink 是一个简单而实用的工具，为 Markdown 文件生成唯一的缩写链接，适用于多种静态网站生成器和前端框架。它提供了以下优势：

- **简单易用**：配置简单，集成方便
- **自动监控**：自动监控文件变化并更新链接
- **算法选择**：支持 crc16 和 crc32 两种算法
- **多技术栈支持**：
  - Vite 插件集成
  - Astro 集成
  - Next.js 插件
  - Nuxt.js 模块

通过使用 abbrlink，您可以为您的 Markdown 文件生成稳定、唯一的链接，避免因文件路径变化导致的链接失效问题，同时支持在不同技术栈中无缝使用。