import fastGlob from 'fast-glob'
import AbbrLink from './utils/abbrLink'
import { writeFile } from 'fs/promises'
import chokidar from 'chokidar'
import { Options } from './model/config'

// Ensure the value is an array
function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

// Normalize the path
function normalizePath(p: string): string {
  return p.startsWith('/') ? p.slice(1) : p
}

export type { Options }

export default ({ paths, ...data }: Options) => {
  const abbrLink = new AbbrLink(data)

  let watcher: chokidar.FSWatcher | null = null

  // Convert the input paths to an array and remove the leading slash from each path
  const configPaths = ensureArray(paths).map(normalizePath)

  /**
   * Get Markdown files under the specified paths
   */
  const getFileMds = async (_paths: string[]): Promise<string[]> => {
    return await fastGlob(_paths, {
      cwd: process.cwd(),
      absolute: true,
      onlyFiles: true,
      ignore: ['node_modules', '**/__tests__'],
    })
  }

  /**
   * Update the content of a Markdown file
   */
  const updateFileContent = async (filePath: string, newMarkdown: any) => {
    try {
      await writeFile(filePath, newMarkdown.value, 'utf-8')
      console.log(`🚀 ~ Generate abbrlink for ${filePath} file: ${newMarkdown.header?.abbrlink}`)
    } catch (error) {
      console.error(`Error writing to file ${filePath}`, error)
    }
  }

  /**
   * @description:  Set abbreviation links
   * @param {string} path The path to the article
   */
  const setAbbrLink = async (path: string | string[]) => {
    await Promise.all(
      ensureArray(path).map(async (filePath) => {
        try {
          const _data = await abbrLink.getMdData(filePath)
          const { data: frontMatter } = _data
          if (!abbrLink.hasAbbrLink(frontMatter)) {
            // Rebuild the Markdown file
            const newMarkdown = await abbrLink.generateAbbrLink(_data)
            // Write the modified content back to the Markdown file
            await updateFileContent(filePath, newMarkdown)
          }
        } catch (error) {
          console.log(`🚀 ~ Error processing file1 ${filePath}`, error)
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

  return {
    initMdsSetAbbrLink,
    watchMdFiles,
    closeWatcher,
    setAbbrLink,
  }
}
