# abbrlink 增强功能设计文档

## 1. 项目背景

abbrlink 是一个用于为 Markdown 文件生成唯一缩写链接的工具，目前支持多种技术栈。根据市场需求分析，需要扩展更多配置功能以满足不同用户场景的需求。

## 2. 功能需求列表

基于市场上类似工具（如 hexo-abbrlink）的分析，确定以下增强功能：

### 2.1 核心功能增强

| 功能 | 优先级 | 描述 |
|------|--------|------|
| 进制表示配置 | P0 | 支持 hex（十六进制）和 dec（十进制）两种格式 |
| 草稿文件过滤 | P0 | 支持识别并排除草稿文件 |
| 强制刷新模式 | P1 | 忽略现有 abbrlink，强制重新生成 |
| 写回开关 | P1 | 控制是否将生成的 abbrlink 写回源文件 |
| 自定义字段名 | P1 | 允许使用除 "abbrlink" 之外的 front matter 字段名 |
| 排除规则 | P2 | 支持通过 glob 模式排除特定文件 |
| 冲突检测与处理 | P2 | 检测 abbrlink 冲突并自动处理 |

## 3. 设计原则

### 3.1 向后兼容性

- 所有新配置项均为可选
- 默认值与现有行为完全一致
- 现有用户无需任何修改即可继续使用

### 3.2 渐进式实现

- 保持现有代码结构
- 逐个添加功能，降低风险
- 每个功能都有充分的测试覆盖

### 3.3 清晰的代码注释

- 所有新增代码包含详细的 JSDoc 注释
- 复杂逻辑添加行内注释说明
- 保持代码可读性和可维护性

## 4. 详细设计

### 4.1 配置接口扩展

#### 4.1.1 AbbrLinkConfig 接口

**文件位置**：[packages/cli/src/model/abbrLink.ts](file:///Users/tangerball/codeBase/abbrlink/packages/cli/src/model/abbrLink.ts)

```typescript
/**
 * @description:  Abbreviated link configuration
 */
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

#### 4.1.2 Options 接口

**文件位置**：[packages/cli/src/model/config.ts](file:///Users/tangerball/codeBase/abbrlink/packages/cli/src/model/config.ts)

```typescript
import { AbbrLinkConfig } from './abbrLink'

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

### 4.2 AbbrLink 类更新

**文件位置**：[packages/cli/src/utils/abbrLink.ts](file:///Users/tangerball/codeBase/abbrlink/packages/cli/src/utils/abbrLink.ts)

#### 4.2.1 构造函数更新

```typescript
class AbbrLink {
  private config: {
    alg: AbbrLinkConfig['alg']
    rep: NonNullable<AbbrLinkConfig['rep']>
    timeOffsetInHours: number
    fieldName: NonNullable<AbbrLinkConfig['fieldName']>
  }

  /**
   * @description Set of generated abbrlinks for conflict detection
   */
  private generatedAbbrlinks: Set<string> = new Set()

  constructor(config: Partial<{
    alg: AbbrLinkConfig['alg']
    rep: AbbrLinkConfig['rep']
    timeOffsetInHours: number
    fieldName: AbbrLinkConfig['fieldName']
  }> = {}) {
    // Default configuration - maintaining backward compatibility
    this.config = {
      alg: 'crc32',
      rep: 'hex',
      timeOffsetInHours: 8,
      fieldName: 'abbrlink',
      ...config,
    }
  }
```

#### 4.2.2 hasAbbrLink 方法更新

```typescript
  /**
   * @description Checks if the article data already has an abbreviated link
   * @param data The front matter data of the article
   * @returns The existing abbrlink value if present, empty string otherwise
   */
  hasAbbrLink(data: any): string {
    // Use the configured field name instead of hardcoding 'abbrlink'
    return data?.[this.config.fieldName] || ''
  }
```

#### 4.2.3 abbrLinkHelper 方法更新

```typescript
  /**
   * @description Generates a unique abbreviated link for each article
   * @param frontMatter The front matter information of the article
   * @returns The generated abbrlink string
   */
  async abbrLinkHelper(frontMatter: FrontMatter): Promise<string> {
    const formatDate = this.localDateTimeString(frontMatter.date)
    let abbrLink: string

    // Calculate CRC based on configured algorithm
    if (this.config.alg === 'crc32') {
      abbrLink = crc32(frontMatter.title + formatDate).toString(16)
    } else {
      abbrLink = crc16(frontMatter.title + formatDate).toString(16)
    }

    // Convert to decimal if rep is 'dec'
    if (this.config.rep === 'dec') {
      // Parse hex string back to number then to decimal string
      abbrLink = parseInt(abbrLink, 16).toString(10)
    }

    return abbrLink || '0'
  }
```

#### 4.2.4 新增冲突检测方法

```typescript
  /**
   * @description Checks if an abbrlink has already been generated and handles conflicts
   * @param abbrlink The abbrlink to check
   * @param filePath The file path for logging purposes
   * @returns A unique abbrlink (original if no conflict, with suffix if conflict)
   */
  checkAndResolveConflict(abbrlink: string, filePath: string): string {
    let uniqueAbbrlink = abbrlink
    let suffix = 2

    // Loop until we find an unused abbrlink
    while (this.generatedAbbrlinks.has(uniqueAbbrlink)) {
      console.warn(
        `⚠️ Conflict detected for file ${filePath}: abbrlink "${uniqueAbbrlink}" already exists. Generating alternative...`
      )
      uniqueAbbrlink = `${abbrlink}-${suffix}`
      suffix++
    }

    // Add the unique abbrlink to our set
    this.generatedAbbrlinks.add(uniqueAbbrlink)
    return uniqueAbbrlink
  }

  /**
   * @description Clears the conflict detection set (useful for reinitialization)
   */
  clearConflictSet(): void {
    this.generatedAbbrlinks.clear()
  }
```

#### 4.2.5 generateAbbrLink 方法更新

```typescript
  /**
   * @description Generates a unique abbreviated link for each article and updates the front matter information
   * @param value An object containing the content and data of the article
   * @param filePath The file path for conflict detection and logging
   * @returns An object containing the updated header and file content
   */
  async generateAbbrLink(
    value: matter.GrayMatterFile<any>,
    filePath?: string,
  ): Promise<{ header: any; value: string }> {
    const frontMatter = value.data as FrontMatter
    let abbrLink = await this.abbrLinkHelper(frontMatter)

    // Check for conflicts if filePath is provided
    if (filePath) {
      abbrLink = this.checkAndResolveConflict(abbrLink, filePath)
    }

    // Update front matter with the configured field name
    const _frontMatter = { ...frontMatter, [this.config.fieldName]: abbrLink }

    // Regenerate the file content with the new front matter
    const newFileContent = matter.stringify(value.content || '', _frontMatter, {
      language: 'yaml',
    })

    return { header: _frontMatter, value: newFileContent }
  }
```

### 4.3 主流程更新

**文件位置**：[packages/cli/src/index.ts](file:///Users/tangerball/codeBase/abbrlink/packages/cli/src/index.ts)

#### 4.3.1 草稿识别函数

```typescript
/**
 * @description Checks if a file is a draft file
 * @param filePath Path to the file
 * @param frontMatter Optional front matter data for additional check
 * @returns true if the file is identified as a draft, false otherwise
 */
function isDraftFile(filePath: string, frontMatter?: any): boolean {
  // Strategy 1: Check file path for draft indicators
  const pathLower = filePath.toLowerCase()
  
  // Check if path contains drafts directory
  if (pathLower.includes('/drafts/') || pathLower.includes('/_drafts/')) {
    return true
  }

  // Check if filename starts with underscore
  const fileName = filePath.split('/').pop() || ''
  if (fileName.startsWith('_')) {
    return true
  }

  // Strategy 2: Check front matter for draft flag
  if (frontMatter && frontMatter.draft === true) {
    return true
  }

  return false
}
```

#### 4.3.2 getFileMds 方法更新

```typescript
  /**
   * @description Get Markdown files under the specified paths
   * @param _paths Array of paths to search
   * @returns Array of absolute file paths
   */
  const getFileMds = async (_paths: string[]): Promise<string[]> => {
    // Prepare ignore patterns
    const ignorePatterns = ['node_modules', '**/__tests__']

    // Add user-specified exclude patterns if provided
    if (options.exclude) {
      const excludeArray = ensureArray(options.exclude)
      ignorePatterns.push(...excludeArray)
    }

    return await fastGlob(_paths, {
      cwd: process.cwd(),
      absolute: true,
      onlyFiles: true,
      ignore: ignorePatterns,
    })
  }
```

#### 4.3.3 setAbbrLink 方法更新

```typescript
  /**
   * @description Set abbreviation links for files
   * @param path Single file path or array of file paths
   */
  const setAbbrLink = async (path: string | string[]) => {
    // Clear conflict set before processing a new batch
    abbrLink.clearConflictSet()

    await Promise.all(
      ensureArray(path).map(async (filePath) => {
        try {
          const _data = await abbrLink.getMdData(filePath)
          const { data: frontMatter } = _data

          // Check if this is a draft file and if we should skip it
          if (!options.drafts && isDraftFile(filePath, frontMatter)) {
            console.log(`⏭️ Skipping draft file: ${filePath}`)
            return
          }

          // Check if we should process this file
          // - If force mode is enabled, always process
          // - Otherwise, only process if no abbrlink exists
          const shouldProcess = options.force || !abbrLink.hasAbbrLink(frontMatter)

          if (shouldProcess) {
            // Rebuild the Markdown file with abbrlink
            const newMarkdown = await abbrLink.generateAbbrLink(_data, filePath)

            // Only write back to file if writeback is enabled
            if (options.writeback !== false) {
              await updateFileContent(filePath, newMarkdown)
            } else {
              console.log(
                `🔍 Generated abbrlink for ${filePath} (dry run): ${
                  newMarkdown.header?.[options.fieldName || 'abbrlink']
                }`
              )
            }
          }
        } catch (error) {
          console.log(`🚀 ~ Error processing file ${filePath}`, error)
        }
      }),
    )
  }
```

#### 4.3.4 updateFileContent 方法更新

```typescript
  /**
   * @description Update the content of a Markdown file
   * @param filePath Path to the file
   * @param newMarkdown Object containing the new markdown content and header
   */
  const updateFileContent = async (filePath: string, newMarkdown: any) => {
    try {
      await writeFile(filePath, newMarkdown.value, 'utf-8')
      const fieldName = options.fieldName || 'abbrlink'
      console.log(`🚀 ~ Generated abbrlink for ${filePath} file: ${newMarkdown.header?.[fieldName]}`)
    } catch (error) {
      console.error(`Error writing to file ${filePath}`, error)
    }
  }
```

### 4.4 完整配置选项参考

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `paths` | string \| string[] | - | 需要处理的 Markdown 文件路径（支持 glob 模式，必需） |
| `alg` | 'crc32' \| 'crc16' | 'crc32' | 生成 abbrlink 的算法 |
| `rep` | 'hex' \| 'dec' | 'hex' | abbrlink 的表示格式（十六进制或十进制） |
| `timeOffsetInHours` | number | 8 | 时区偏移量（小时） |
| `fieldName` | string | 'abbrlink' | front matter 中的字段名 |
| `drafts` | boolean | false | 是否处理草稿文件 |
| `force` | boolean | false | 强制模式，忽略已存在的 abbrlink 并重新生成 |
| `writeback` | boolean | true | 是否将更改写回实际的 Markdown 文件 |
| `exclude` | string \| string[] | - | 要排除处理的文件模式（支持 glob） |

### 4.5 使用示例

#### 4.5.1 基本使用（向后兼容）

```javascript
import createAbbrlink from 'abbrlink'

const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  alg: 'crc32',
  timeOffsetInHours: 8
})

await abbrlink.initMdsSetAbbrLink()
```

#### 4.5.2 使用十进制格式

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  rep: 'dec'  // 使用十进制格式
})
```

#### 4.5.3 自定义字段名

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  fieldName: 'shortId'  // 使用 shortId 而不是 abbrlink
})
```

#### 4.5.4 包含草稿文件

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  drafts: true  // 处理草稿文件
})
```

#### 4.5.5 强制刷新（重新生成所有）

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  force: true  // 强制重新生成所有 abbrlink
})
```

#### 4.5.6 试运行（不修改文件）

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  writeback: false  // 只在内存中生成，不写回文件
})
```

#### 4.5.7 排除特定文件

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  exclude: ['**/README.md', '**/temp.md']  // 排除 README 和临时文件
})
```

#### 4.5.8 完整配置示例

```javascript
const abbrlink = createAbbrlink({
  paths: ['content/posts/**/*.md', 'content/pages/**/*.md'],
  alg: 'crc32',
  rep: 'hex',
  timeOffsetInHours: 8,
  fieldName: 'permalinkId',
  drafts: false,
  force: false,
  writeback: true,
  exclude: ['**/drafts/**', '**/_*.md']
})
```

## 5. 测试计划

### 5.1 单元测试

为每个新增功能编写单元测试：

1. 进制表示测试（hex/dec）
2. 自定义字段名测试
3. 草稿文件识别测试
4. 强制刷新模式测试
5. 写回开关测试
6. 排除规则测试
7. 冲突检测与处理测试

### 5.2 集成测试

1. 测试所有配置项的组合使用
2. 测试向后兼容性（旧配置仍能正常工作）
3. 测试各个技术栈插件的集成

### 5.3 测试命令

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## 6. 发布计划

1. 更新核心包（cli）的代码
2. 更新所有插件包的类型定义（如果需要）
3. 更新 README.md 文档
4. 运行完整测试套件
5. 发布新版本

## 7. 总结

本设计文档详细描述了 abbrlink 增强功能的实现方案，遵循以下原则：

- ✅ 完全向后兼容
- ✅ 详细的代码注释
- ✅ 清晰的架构设计
- ✅ 充分的测试覆盖
- ✅ 渐进式实现，降低风险

通过这些增强功能，abbrlink 将能够满足更广泛的用户场景需求，提供更灵活的配置选项。
