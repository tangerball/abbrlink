# gatsby-plugin-abbrlink

> 一个为 Markdown 文件生成唯一缩写链接的 Gatsby 插件

## 🏁 安装

将包作为依赖安装：

```bash
pnpm add gatsby-plugin-abbrlink
# 或
npm install gatsby-plugin-abbrlink
# 或
yarn add gatsby-plugin-abbrlink
```

## 🚀 使用

在 `gatsby-config.js` 中添加到插件配置：

```js
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

## 🛠️ 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|--------|------|---------|-------------|
| `paths` | string \| string[] | - | 需要处理的 Markdown 文件路径（支持 glob 模式） |
| `alg` | 'crc32' \| 'crc16' | 'crc32' | 生成 abbrlink 的算法 |
| `rep` | 'hex' \| 'dec' | 'hex' | 表示格式（十六进制或十进制） |
| `timeOffsetInHours` | number | 8 | 时区偏移量（小时） |
| `fieldName` | string | 'abbrlink' | front matter 中的字段名 |
| `drafts` | boolean | false | 是否处理草稿文件 |
| `force` | boolean | false | 强制模式 - 即使已存在 abbrlink 也重新生成 |
| `writeback` | boolean | true | 是否将更改写回文件 |
| `exclude` | string \| string[] | - | 要排除的文件模式（支持 glob） |

## 🔧 高级用法

### 使用十进制格式

```js
{
  resolve: 'gatsby-plugin-abbrlink',
  options: {
    paths: 'src/**/*.md',
    rep: 'dec'  // 使用十进制格式
  }
}
```

### 自定义字段名

```js
{
  resolve: 'gatsby-plugin-abbrlink',
  options: {
    paths: 'src/**/*.md',
    fieldName: 'shortId'  // 使用自定义字段名
  }
}
```

### 排除文件

```js
{
  resolve: 'gatsby-plugin-abbrlink',
  options: {
    paths: 'src/**/*.md',
    exclude: ['**/drafts/**', '**/README.md']  // 排除特定文件
  }
}
```

## 📝 示例

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

### 输出（十进制格式）

```markdown
---
title: Hello World
date: 2023-01-01
abbrlink: 1690090958
---

Hello World!
```

### 输出（自定义字段名）

```markdown
---
title: Hello World
date: 2023-01-01
shortId: a1b2c3d4
---

Hello World!
```

## 🎯 工作原理

1. 插件会在 Gatsby 引导过程中扫描配置的 Markdown 文件
2. 对于每个文件，检查是否存在配置的字段（默认：`abbrlink`）
3. 如果不存在，根据文件的标题和日期生成唯一的缩写链接
4. 将链接添加到文件的 front matter 中
5. 在开发过程中，监听文件变化并自动更新链接

## 📦 兼容性

- Gatsby 4.x+
- Node.js 16+

## 🪪 许可证

MIT
