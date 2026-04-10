# abbrlink

> Add the abbrlink attribute to the markdown file in the specified directory

<br>

According to [hexo-abbrlink](https://github.com/Rozbo/hexo-abbrlink) functional logic implementation

## 🏁 Installation

Install the package as a devDependencies

```bash
pnpm add abbrlink -D
```

## 🚀 Usage

```ts
import abbrlink from 'abbrlink'
const { initPathsAndLinks, watchMdFiles, closeWatcher } = abbrlink(options)

// Initialize the Markdown file and set the abbreviation link.
initMdsSetAbbrLink()

// Monitor the markdowm file and write it to the abbrlink field.
watchMdFiles()

// When the terminal is closed, the monitoring function can be called.
closeWatcher()
```

## 🛠️ Options

### `paths`

**Type:**`string | string[]`

**Default:**`[]`

To set up the md file in the directory you need, use regular expressions, such as src/content/\*_/_.md

### `alg`

**Type:**`'crc32' | 'crc16'`

**Default:** `crc32`

Algorithm (currently supports crc16 and crc32, default is crc16)

## Sample

The generated link will look like the following

```
crc16
https://tangerball.com/posts/66c8
```

```
crc32 & hex
https://tangerball.com/posts/8ddf18fb
```
