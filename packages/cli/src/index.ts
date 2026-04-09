import fastGlob from 'fast-glob'
import AbbrLink from './utils/abbrLink'
import { writeFile } from 'fs/promises'
import chokidar from 'chokidar'
import { Options } from './model/config'

// Ensure the value is an array
export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

// Normalize the path
export function normalizePath(p: string): string {
  return p.startsWith('/') ? p.slice(1) : p
}

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

export type { Options }

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

  let watcher: chokidar.FSWatcher | null = null

  // Convert the input paths to an array and remove the leading slash from each path
  const configPaths = ensureArray(options.paths).map(normalizePath)

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

  /**
   * @description:  Initialize the Markdown file and set the abbreviation link.
   */
  const initMdsSetAbbrLink = async () => {
    const _paths = await getFileMds(configPaths)
    // Set all abbreviation links
    await setAbbrLink(_paths)
  }

  /**
   * @description:  Monitor the markdowm file and write it to the abbrlink field.
   */
  const watchMdFiles = () => {
    // Set up a file system watcher after the configuration is resolved
    watcher = chokidar.watch(
      configPaths.map((path) => process.cwd() + '/' + path),
      {
        persistent: true,
        ignoreInitial: false,
      },
    )

    watcher.on('change', async (path) => {
      // When a file changes, update its abbreviation link
      await setAbbrLink(path)
    })
  }

  /**
   * @description: When the terminal is closed, the monitoring function can be called.
   */
  const closeWatcher = () => {
    if (watcher) {
      watcher.close()
    }
  }

  /**
   * @description: Get Vite plugin
   */
  const getVitePlugin = () => {
    return {
      name: 'vite-plugin-abbrLink',
      async buildStart() {
        await initMdsSetAbbrLink()
      },
      async configResolved() {
        await watchMdFiles()
      },
      closeBundle() {
        closeWatcher()
      },
    }
  }

  /**
   * @description: Get Astro integration
   */
  const getAstroIntegration = () => {
    return {
      name: 'astro-abbrlink',
      hooks: {
        'astro:build:start': async () => {
          await initMdsSetAbbrLink()
        },
        'astro:server:start': async () => {
          await watchMdFiles()
        },
        'astro:server:stop': async () => {
          closeWatcher()
        },
      },
    }
  }

  /**
   * @description: Get Next.js plugin
   */
  const getNextjsPlugin = () => {
    return {
      name: 'nextjs-abbrlink',
      async module(_module: any) {
        // Initialize abbrlink when the module is loaded
        await initMdsSetAbbrLink()
        // Start watching files
        watchMdFiles()
        
        // Cleanup on process exit
        process.on('exit', closeWatcher)
        
        return _module
      },
    }
  }

  /**
   * @description: Get Nuxt.js module
   */
  const getNuxtModule = () => {
    return {
      name: 'nuxt-abbrlink',
      setup() {
        // Initialize abbrlink
        initMdsSetAbbrLink()
        // Start watching files
        watchMdFiles()
        
        // Cleanup on process exit
        process.on('exit', closeWatcher)
      },
    }
  }

  /**
   * @description: Get Gatsby plugin
   */
  const getGatsbyPlugin = () => {
    return {
      name: 'gatsby-plugin-abbrlink',
      async onPreBootstrap() {
        // Initialize abbrlink before bootstrap
        await initMdsSetAbbrLink()
      },
      async onCreateNode({ node }: any) {
        // Watch for Markdown files
        if (node.internal.type === 'MarkdownRemark') {
          await setAbbrLink(node.fileAbsolutePath)
        }
      },
    }
  }

  /**
   * @description: Get Hexo plugin
   */
  const getHexoPlugin = () => {
    return {
      name: 'hexo-plugin-abbrlink',
      init(hexo: any) {
        // Register filter for post processing
        hexo.extend.filter.register('before_post_render', async (data: any) => {
          // Get file path from data
          const filePath = data.source || data.path
          if (filePath) {
            await setAbbrLink(filePath)
          }
          return data
        })
      },
    }
  }

  /**
   * @description: Get Eleventy plugin
   */
  const getEleventyPlugin = () => {
    return {
      name: 'eleventy-plugin-abbrlink',
      init(eleventyConfig: any) {
        // Add transform for Markdown files
        eleventyConfig.addTransform('abbrlink', async (content: string, outputPath: string) => {
          if (outputPath && outputPath.endsWith('.md')) {
            await setAbbrLink(outputPath)
          }
          return content
        })
      },
    }
  }

  /**
   * @description: Get VuePress plugin
   */
  const getVuePressPlugin = () => {
    return {
      name: 'vuepress-plugin-abbrlink',
      onInitialized() {
        // Initialize abbrlink
        initMdsSetAbbrLink()
      },
      extendsMarkdown(md: any) {
        // Add abbrlink processing
        const defaultRender = md.render
        md.render = async (src: string, env: any) => {
          if (env.filePath && env.filePath.endsWith('.md')) {
            await setAbbrLink(env.filePath)
          }
          return defaultRender(src, env)
        }
      },
    }
  }

  /**
   * @description: Get SvelteKit plugin
   */
  const getSvelteKitPlugin = () => {
    return {
      name: 'sveltekit-plugin-abbrlink',
      async handle({ event, resolve }: any) {
        // Initialize abbrlink on first request
        await initMdsSetAbbrLink()
        // Start watching files
        watchMdFiles()
        
        // Cleanup on process exit
        process.on('exit', closeWatcher)
        
        return resolve(event)
      },
    }
  }

  /**
   * @description: Get Remix plugin
   */
  const getRemixPlugin = () => {
    return {
      name: 'remix-plugin-abbrlink',
      async buildStart() {
        // Initialize abbrlink on build start
        await initMdsSetAbbrLink()
      },
    }
  }

  return {
    initMdsSetAbbrLink,
    watchMdFiles,
    closeWatcher,
    setAbbrLink,
    getVitePlugin,
    getAstroIntegration,
    getNextjsPlugin,
    getNuxtModule,
    getGatsbyPlugin,
    getHexoPlugin,
    getEleventyPlugin,
    getVuePressPlugin,
    getSvelteKitPlugin,
    getRemixPlugin,
  }
}
