# abbrlink

一个用于为 Markdown 文件生成唯一缩写链接的工具，支持多种技术栈。

## 功能特性

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

## 安装

### 核心包

```bash
npm install abbrlink
```

### 技术栈插件

根据您使用的技术栈，安装对应的插件：

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

## 配置选项

所有插件都使用统一的配置格式：

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

## 使用方式

### 1. 核心包使用

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

### 2. Vite 插件

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

### 3. Astro 集成

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
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
  exclude: ['**/drafts/**']
})

export default defineConfig({
  integrations: [
    abbrlink.getAstroIntegration()
  ]
})
```

### 4. Next.js 插件

```javascript
// next.config.js
const createAbbrlink = require('abbrlink')

const abbrlink = createAbbrlink({
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

module.exports = {
  webpack: (config) => {
    config.plugins.push(abbrlink.getNextjsPlugin())
    return config
  }
}
```

### 5. Nuxt.js 模块

```javascript
// nuxt.config.js
import createAbbrlink from 'abbrlink'

const abbrlink = createAbbrlink({
  paths: 'content/**/*.md',
  alg: 'crc32',
  rep: 'hex',
  timeOffsetInHours: 8,
  fieldName: 'abbrlink',
  drafts: false,
  force: false,
  writeback: true,
  exclude: ['**/drafts/**']
})

export default defineNuxtConfig({
  modules: [
    abbrlink.getNuxtModule()
  ]
})
```

### 6. Gatsby 插件

```javascript
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-abbrlink',
      options: {
        paths: 'src/**/*.md',
        alg: 'crc32',
        rep: 'hex',
        timeOffsetInHours: 8,
        fieldName: 'abbrlink',
        drafts: false,
        force: false,
        writeback: true,
        exclude: ['**/README.md']
      }
    }
  ]
}
```

### 7. Hexo 插件

```yaml
# _config.yml
plugins:
  - hexo-plugin-abbrlink

abbrlink:
  paths: 'source/**/*.md'
  alg: crc32
  rep: hex
  timeOffsetInHours: 8
  fieldName: abbrlink
  drafts: false
  force: false
  writeback: true
  exclude: ['**/README.md', '**/drafts/**']
```

### 8. Eleventy 插件

```javascript
// eleventy.config.js
const eleventyPluginAbbrlink = require('eleventy-plugin-abbrlink')

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyPluginAbbrlink, {
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
}
```

### 9. VuePress 插件

```javascript
// config.js
module.exports = {
  plugins: [
    [
      'vuepress-plugin-abbrlink',
      {
        paths: 'src/**/*.md',
        alg: 'crc32',
        rep: 'hex',
        timeOffsetInHours: 8,
        fieldName: 'abbrlink',
        drafts: false,
        force: false,
        writeback: true,
        exclude: ['**/README.md']
      }
    ]
  ]
}
```

### 10. SvelteKit 插件

```javascript
// svelte.config.js
import { sveltekit } from '@sveltejs/kit/vite'
import sveltekitPluginAbbrlink from 'sveltekit-plugin-abbrlink'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    hooks: {
      handle: sveltekitPluginAbbrlink({
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
    }
  }
}

export default config
```

### 11. Remix 插件

```javascript
// remix.config.js
const { withAbbrlink } = require('remix-plugin-abbrlink')

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = withAbbrlink({
  // Remix 配置
}, {
  paths: 'app/**/*.md',
  alg: 'crc32',
  rep: 'hex',
  timeOffsetInHours: 8,
  fieldName: 'abbrlink',
  drafts: false,
  force: false,
  writeback: true,
  exclude: ['**/README.md']
})
```

## 高级使用示例

### 使用十进制格式

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  rep: 'dec'  // 使用十进制格式
})
```

### 自定义字段名

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  fieldName: 'shortId'  // 使用 shortId 而不是 abbrlink
})
```

### 包含草稿文件

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  drafts: true  // 处理草稿文件
})
```

### 强制刷新（重新生成所有）

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  force: true  // 强制重新生成所有 abbrlink
})
```

### 试运行（不修改文件）

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  writeback: false  // 只在内存中生成，不写回文件
})
```

### 排除特定文件

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  exclude: ['**/README.md', '**/temp.md']  // 排除 README 和临时文件
})
```

## 工作原理

1. 插件会扫描配置的 Markdown 文件路径
2. 对于每个 Markdown 文件，检查是否已有配置的字段名（默认为 `abbrlink`）
3. 如果没有，根据文件的标题和日期生成唯一的缩写链接
4. 将生成的缩写链接添加到文件的 front matter 中
5. 在开发模式下，监听文件变化并自动更新缩写链接

## 示例

### 输入

```markdown
---
title: Hello World
date: 2023-01-01
---

Hello World!
```

### 输出（默认配置）

```markdown
---
title: Hello World
date: 2023-01-01
abbrlink: a1b2c3d4
---

Hello World!
```

### 输出（使用十进制格式）

```markdown
---
title: Hello World
date: 2023-01-01
abbrlink: 1690090958
---

Hello World!
```

### 输出（使用自定义字段名）

```markdown
---
title: Hello World
date: 2023-01-01
shortId: a1b2c3d4
---

Hello World!
```

## 常见问题

### 1. 生成的 abbrlink 是什么格式？

默认生成的 abbrlink 是基于 CRC 算法的十六进制字符串，例如 `a1b2c3d4`。您也可以通过 `rep` 配置选择十进制格式，例如 `1690090958`。

### 2. abbrlink 是如何保证唯一性的？

abbrlink 基于文件的标题和日期生成，确保在相同输入下生成相同的结果，不同输入下生成不同的结果。同时，插件会检测 abbrlink 冲突并自动处理，确保生成的链接唯一。

### 3. 可以自定义 abbrlink 的长度吗？

目前不支持自定义长度，长度由选择的算法决定（CRC32 生成 8 位，CRC16 生成 4 位）。

### 4. 如何在模板中使用 abbrlink？

您可以在模板中通过 front matter 访问 abbrlink，例如：

```jsx
// React 示例
{frontmatter.abbrlink}

// Vue 示例
{{ frontmatter.abbrlink }}

// 自定义字段名示例
{frontmatter.shortId}
```

### 5. 如何识别草稿文件？

插件会通过以下方式识别草稿文件：
- 文件路径包含 `drafts/` 或 `_drafts/` 目录
- 文件名以下划线 `_` 开头
- front matter 中包含 `draft: true` 字段

### 6. 如何处理 abbrlink 冲突？

当检测到 abbrlink 冲突时，插件会：
1. 发出警告日志，提示冲突的文件和 abbrlink 值
2. 自动重新生成一个带后缀的 abbrlink（例如：`a1b2c3d4-2`）
3. 确保最终生成的 abbrlink 唯一

## 许可证

MIT
