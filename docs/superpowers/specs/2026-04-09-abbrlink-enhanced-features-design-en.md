# abbrlink Enhanced Features Design Document

## 1. Project Background

abbrlink is a tool for generating unique abbreviated links for Markdown files, currently supporting multiple tech stacks. Based on market demand analysis, we need to extend more configuration features to meet different user scenarios.

## 2. Feature Requirements List

Based on analysis of similar tools in the market (like hexo-abbrlink), the following enhanced features are identified:

### 2.1 Core Feature Enhancements

| Feature | Priority | Description |
|---------|----------|-------------|
| Representation Format Configuration | P0 | Support hex (hexadecimal) and dec (decimal) formats |
| Draft File Filtering | P0 | Support identifying and excluding draft files |
| Force Refresh Mode | P1 | Ignore existing abbrlink and force regeneration |
| Writeback Toggle | P1 | Control whether to write generated abbrlink back to source files |
| Custom Field Name | P1 | Allow using front matter field names other than "abbrlink" |
| Exclusion Rules | P2 | Support excluding specific files via glob patterns |
| Conflict Detection and Handling | P2 | Detect abbrlink conflicts and handle them automatically |

## 3. Design Principles

### 3.1 Backward Compatibility

- All new configuration options are optional
- Default values are completely consistent with existing behavior
- Existing users can continue to use without any modifications

### 3.2 Progressive Implementation

- Maintain existing code structure
- Add features one by one to reduce risk
- Each feature has sufficient test coverage

### 3.3 Clear Code Comments

- All new code includes detailed JSDoc comments
- Add inline comments for complex logic
- Maintain code readability and maintainability

## 4. Detailed Design

### 4.1 Configuration Interface Extension

#### 4.1.1 AbbrLinkConfig Interface

**File Location**: [packages/cli/src/model/abbrLink.ts](file:///Users/tangerball/codeBase/abbrlink/packages/cli/src/model/abbrLink.ts)

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

#### 4.1.2 Options Interface

**File Location**: [packages/cli/src/model/config.ts](file:///Users/tangerball/codeBase/abbrlink/packages/cli/src/model/config.ts)

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

### 4.2 AbbrLink Class Update

**File Location**: [packages/cli/src/utils/abbrLink.ts](file:///Users/tangerball/codeBase/abbrlink/packages/cli/src/utils/abbrLink.ts)

#### 4.2.1 Constructor Update

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

#### 4.2.2 hasAbbrLink Method Update

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

#### 4.2.3 abbrLinkHelper Method Update

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

#### 4.2.4 New Conflict Detection Methods

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

#### 4.2.5 generateAbbrLink Method Update

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

### 4.3 Main Flow Update

**File Location**: [packages/cli/src/index.ts](file:///Users/tangerball/codeBase/abbrlink/packages/cli/src/index.ts)

#### 4.3.1 Draft File Detection Function

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

#### 4.3.2 getFileMds Method Update

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

#### 4.3.3 setAbbrLink Method Update

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

#### 4.3.4 updateFileContent Method Update

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

### 4.4 Complete Configuration Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `paths` | string \| string[] | - | Paths to Markdown files to process (supports glob patterns, required) |
| `alg` | 'crc32' \| 'crc16' | 'crc32' | Algorithm for generating abbrlink |
| `rep` | 'hex' \| 'dec' | 'hex' | Representation format of abbrlink (hexadecimal or decimal) |
| `timeOffsetInHours` | number | 8 | Time zone offset in hours |
| `fieldName` | string | 'abbrlink' | Field name in front matter |
| `drafts` | boolean | false | Whether to process draft files |
| `force` | boolean | false | Force mode - regenerate even if abbrlink exists |
| `writeback` | boolean | true | Whether to write changes back to Markdown files |
| `exclude` | string \| string[] | - | File patterns to exclude from processing (supports glob) |

### 4.5 Usage Examples

#### 4.5.1 Basic Usage (Backward Compatible)

```javascript
import createAbbrlink from 'abbrlink'

const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  alg: 'crc32',
  timeOffsetInHours: 8
})

await abbrlink.initMdsSetAbbrLink()
```

#### 4.5.2 Using Decimal Format

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  rep: 'dec'  // Use decimal format
})
```

#### 4.5.3 Custom Field Name

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  fieldName: 'shortId'  // Use shortId instead of abbrlink
})
```

#### 4.5.4 Include Draft Files

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  drafts: true  // Process draft files
})
```

#### 4.5.5 Force Refresh (Regenerate All)

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  force: true  // Force regenerate all abbrlink
})
```

#### 4.5.6 Dry Run (No File Modification)

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  writeback: false  // Only generate in memory, don't write back to files
})
```

#### 4.5.7 Exclude Specific Files

```javascript
const abbrlink = createAbbrlink({
  paths: 'src/**/*.md',
  exclude: ['**/README.md', '**/temp.md']  // Exclude README and temporary files
})
```

#### 4.5.8 Complete Configuration Example

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

## 5. Testing Plan

### 5.1 Unit Tests

Write unit tests for each new feature:

1. Representation format tests (hex/dec)
2. Custom field name tests
3. Draft file identification tests
4. Force refresh mode tests
5. Writeback toggle tests
6. Exclusion rules tests
7. Conflict detection and handling tests

### 5.2 Integration Tests

1. Test combinations of all configuration options
2. Test backward compatibility (old configurations still work)
3. Test integration with each tech stack plugin

### 5.3 Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

## 6. Release Plan

1. Update core package (cli) code
2. Update type definitions for all plugin packages (if needed)
3. Update README.md documentation
4. Run complete test suite
5. Release new version

## 7. Summary

This design document details the implementation plan for abbrlink enhanced features, following these principles:

- ✅ Completely backward compatible
- ✅ Detailed code comments
- ✅ Clear architecture design
- ✅ Sufficient test coverage
- ✅ Progressive implementation to reduce risk

With these enhanced features, abbrlink will be able to meet a wider range of user scenarios and provide more flexible configuration options.
