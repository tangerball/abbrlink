# vite-plugin-abbrlink

> A Vite plugin to generate unique abbreviated links for Markdown files

## 🏁 Installation

Install the package as a dev dependency:

```bash
pnpm add vite-plugin-abbrlink -D
# or
npm install vite-plugin-abbrlink --save-dev
# or
yarn add vite-plugin-abbrlink -D
```

## 🚀 Usage

Add it to your plugins in `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vitePluginAbbrLink from 'vite-plugin-abbrlink'

export default defineConfig({
  plugins: [
    vitePluginAbbrLink({
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

## 🛠️ Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `paths` | string \| string[] | - | Paths to Markdown files to process (supports glob patterns) |
| `alg` | 'crc32' \| 'crc16' | 'crc32' | Algorithm for generating abbrlink |
| `rep` | 'hex' \| 'dec' | 'hex' | Representation format (hexadecimal or decimal) |
| `timeOffsetInHours` | number | 8 | Time zone offset in hours |
| `fieldName` | string | 'abbrlink' | Field name in front matter |
| `drafts` | boolean | false | Whether to process draft files |
| `force` | boolean | false | Force mode - regenerate even if abbrlink exists |
| `writeback` | boolean | true | Whether to write changes back to files |
| `exclude` | string \| string[] | - | File patterns to exclude (supports glob) |

## 🔧 Advanced Usage

### Using Decimal Format

```ts
vitePluginAbbrLink({
  paths: 'src/**/*.md',
  rep: 'dec'  // Use decimal format
})
```

### Custom Field Name

```ts
vitePluginAbbrLink({
  paths: 'src/**/*.md',
  fieldName: 'shortId'  // Use custom field name
})
```

### Excluding Files

```ts
vitePluginAbbrLink({
  paths: 'src/**/*.md',
  exclude: ['**/drafts/**', '**/README.md']  // Exclude specific files
})
```

## 📝 Examples

### Input

```markdown
---
title: Hello World
date: 2023-01-01
---

Hello World!
```

### Output (Default Configuration)

```markdown
---
title: Hello World
date: 2023-01-01
abbrlink: a1b2c3d4
---

Hello World!
```

### Output (Decimal Format)

```markdown
---
title: Hello World
date: 2023-01-01
abbrlink: 1690090958
---

Hello World!
```

### Output (Custom Field Name)

```markdown
---
title: Hello World
date: 2023-01-01
shortId: a1b2c3d4
---

Hello World!
```

## 🎯 How It Works

1. The plugin scans the configured Markdown files
2. For each file, it checks if the configured field (default: `abbrlink`) exists
3. If not, it generates a unique abbreviated link based on the file's title and date
4. The link is added to the file's front matter
5. In development mode, it watches for file changes and updates links automatically

## 📦 Compatibility

- Vite 4.x+
- Node.js 16+

## 🪪 License

MIT
