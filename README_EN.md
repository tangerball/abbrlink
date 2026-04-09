# abbrlink

A tool for generating unique abbreviated links for Markdown files, supporting multiple tech stacks.

## Features

- Generates unique abbreviated links for Markdown files
- Supports multiple tech stacks: Vite, Astro, Next.js, Nuxt.js, Gatsby, Hexo, Eleventy, VuePress, SvelteKit, Remix
- Provides a unified configuration format
- Supports CRC32 and CRC16 algorithms
- Supports time zone offset configuration
- Supports representation format configuration (hexadecimal/decimal)
- Supports custom front matter field name
- Supports draft file filtering
- Supports force refresh mode
- Supports writeback toggle control
- Supports file exclusion rules
- Supports conflict detection and handling
- Automatically detects file changes and updates abbreviated links

## Installation

### Core Package

```bash
npm install abbrlink
```

### Tech Stack Plugins

Install the corresponding plugin based on your tech stack:

```bash
# Vite
npm