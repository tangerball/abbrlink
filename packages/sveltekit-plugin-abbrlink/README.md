# sveltekit-plugin-abbrlink

> A SvelteKit plugin to generate unique abbreviated links for Markdown files

## 🏁 Installation

Install the package as a dependency:

```bash
pnpm add sveltekit-plugin-abbrlink
# or
npm install sveltekit-plugin-abbrlink
# or
yarn add sveltekit-plugin-abbrlink
```

## 🚀 Usage

Add the plugin to your `svelte.config.js` or `svelte.config.ts` file:

```javascript
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

```javascript
hooks: {
  handle: sveltekitPluginAbbrlink({
    paths: 'src/**/*.md',
    rep: 'dec'  // Use decimal format
  })
}
```

### Custom Field Name

```javascript
hooks: {
  handle: sveltekitPluginAbbrlink({
    paths: 'src/**/*.md',
    fieldName: 'shortId'  // Use custom field name
  })
}
```

### Excluding Files

```javascript
hooks: {
  handle: sveltekitPluginAbbrlink({
    paths: 'src/**/*.md',
    exclude: ['**/drafts/**', '**/README.md']  // Exclude specific files
  })
}
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

1. The plugin scans the configured Markdown files during SvelteKit's build process
2. For each file, it checks if the configured field (default: `abbrlink`) exists
3. If not, it generates a unique abbreviated link based on the file's title and date
4. The link is added to the file's front matter
5. It processes files automatically during SvelteKit's build process

## 📦 Compatibility

- SvelteKit 1.x+
- Node.js 16+

## 🪪 License

MIT