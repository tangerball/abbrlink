# abbrlink Enhanced Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement enhanced features for abbrlink including representation format, custom field name, draft filtering, force refresh, writeback control, exclusion rules, and conflict detection.

**Architecture:** Extend existing configuration interfaces, update core AbbrLink class, and modify main workflow to support new features while maintaining backward compatibility.

**Tech Stack:** TypeScript, Node.js, CRC algorithms, Markdown front matter parsing.

---

## File Structure

**Files to modify:**
1. `packages/cli/src/model/abbrLink.ts` - Extend AbbrLinkConfig interface
2. `packages/cli/src/model/config.ts` - Extend Options interface
3. `packages/cli/src/utils/abbrLink.ts` - Update AbbrLink class with new features
4. `packages/cli/src/index.ts` - Update main workflow with new functionality

## Task 1: Extend AbbrLinkConfig Interface

**Files:**
- Modify: `packages/cli/src/model/abbrLink.ts`

- [ ] **Step 1: Update AbbrLinkConfig interface**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/model/abbrLink.ts
git commit -m "feat: extend AbbrLinkConfig interface with new options"
```

## Task 2: Extend Options Interface

**Files:**
- Modify: `packages/cli/src/model/config.ts`

- [ ] **Step 1: Update Options interface**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/model/config.ts
git commit -m "feat: extend Options interface with new configuration options"
```

## Task 3: Update AbbrLink Class - Constructor and Config

**Files:**
- Modify: `packages/cli/src/utils/abbrLink.ts`

- [ ] **Step 1: Update class constructor and config**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/utils/abbrLink.ts
git commit -m "feat: update AbbrLink constructor with new config options"
```

## Task 4: Update AbbrLink Class - hasAbbrLink Method

**Files:**
- Modify: `packages/cli/src/utils/abbrLink.ts`

- [ ] **Step 1: Update hasAbbrLink method**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/utils/abbrLink.ts
git commit -m "feat: update hasAbbrLink method to use configured field name"
```

## Task 5: Update AbbrLink Class - abbrLinkHelper Method

**Files:**
- Modify: `packages/cli/src/utils/abbrLink.ts`

- [ ] **Step 1: Update abbrLinkHelper method**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/utils/abbrLink.ts
git commit -m "feat: update abbrLinkHelper method to support decimal format"
```

## Task 6: Add Conflict Detection Methods

**Files:**
- Modify: `packages/cli/src/utils/abbrLink.ts`

- [ ] **Step 1: Add conflict detection methods**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/utils/abbrLink.ts
git commit -m "feat: add conflict detection and resolution methods"
```

## Task 7: Update AbbrLink Class - generateAbbrLink Method

**Files:**
- Modify: `packages/cli/src/utils/abbrLink.ts`

- [ ] **Step 1: Update generateAbbrLink method**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/utils/abbrLink.ts
git commit -m "feat: update generateAbbrLink method to support new features"
```

## Task 8: Update Main Flow - Draft Detection Function

**Files:**
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Add draft detection function**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/index.ts
git commit -m "feat: add draft file detection function"
```

## Task 9: Update Main Flow - getFileMds Method

**Files:**
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Update getFileMds method**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/index.ts
git commit -m "feat: update getFileMds method to support exclude patterns"
```

## Task 10: Update Main Flow - setAbbrLink Method

**Files:**
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Update setAbbrLink method**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/index.ts
git commit -m "feat: update setAbbrLink method with new features"
```

## Task 11: Update Main Flow - updateFileContent Method

**Files:**
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Update updateFileContent method**

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

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/index.ts
git commit -m "feat: update updateFileContent method to use configured field name"
```

## Task 12: Update Main Flow - createAbbrlink Function Signature

**Files:**
- Modify: `packages/cli/src/index.ts`

- [ ] **Step 1: Update createAbbrlink function signature**

```typescript
/**
 * @description: Main function to create abbrlink instance
 * @param options: Configuration options
 * @returns: Abbrlink instance with methods for different build tools
 */
export default function createAbbrlink(options: Options) {
  const abbrLink = new AbbrLink({
    alg: options.alg,
    rep: options.rep,
    timeOffsetInHours: options.timeOffsetInHours,
    fieldName: options.fieldName
  })

  // Rest of the function remains the same...
```

- [ ] **Step 2: Commit changes**

```bash
git add packages/cli/src/index.ts
git commit -m "feat: update createAbbrlink function to pass all options"
```

## Task 13: Run Tests

**Files:**
- Test: `packages/cli/src/abbrLink.test.ts`
- Test: `packages/cli/src/index.test.ts`

- [ ] **Step 1: Run existing tests**

```bash
npm test
```

- [ ] **Step 2: Fix any test failures**

If tests fail, fix the issues and re-run until all tests pass.

- [ ] **Step 3: Commit test fixes**

```bash
git add packages/cli/src/*.test.ts
git commit -m "fix: update tests to work with new features"
```

## Task 14: Build and Verify

**Files:**
- All files

- [ ] **Step 1: Build the project**

```bash
npm run build
```

- [ ] **Step 2: Check for any build errors**

Fix any build errors if they occur.

- [ ] **Step 3: Commit build fixes**

```bash
git add packages/cli/src/
git commit -m "fix: resolve build errors"
```

---

## Self-Review

### 1. Spec Coverage

- ✅ Representation format configuration (rep: 'hex' | 'dec')
- ✅ Custom front matter field name (fieldName)
- ✅ Draft file filtering (drafts)
- ✅ Force refresh mode (force)
- ✅ Writeback toggle (writeback)
- ✅ Exclusion rules (exclude)
- ✅ Conflict detection and handling

### 2. Placeholder Scan

- ✅ No TBD or TODO items
- ✅ All code examples are complete
- ✅ All steps have specific commands
- ✅ No vague instructions

### 3. Type Consistency

- ✅ All types and method signatures are consistent
- ✅ Field names are used consistently throughout
- ✅ Configuration options are passed correctly

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-09-abbrlink-enhanced-features.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
