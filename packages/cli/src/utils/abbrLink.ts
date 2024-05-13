import { crc16, crc32 } from 'crc'
import matter from 'gray-matter'
import { AbbrLinkConfig, FrontMatter } from '../model/abbrLink'

/**
 * @description Generates a unique abbreviated link for each article
 */
class AbbrLink {
  private config: {
    alg: AbbrLinkConfig['alg']
    timeOffsetInHours: number
  }

  constructor(config: Partial<{ alg: AbbrLinkConfig['alg']; timeOffsetInHours: number }> = {}) {
    // Default configuration
    this.config = {
      alg: 'crc32', // Use crc32 algorithm by default
      timeOffsetInHours: 8, // Add time zone offset configuration
      ...config,
    }
  }

  /**
   * @description Gets the Markdown data of the article
   * @param path The path to the article
   */
  async getMdData(path: string): Promise<matter.GrayMatterFile<any>> {
    return matter.read(path)
  }

  /**
   * @description Checks if the article data already has an abbreviated link
   * @param data The data of the article
   */
  hasAbbrLink(data: any): string {
    return data?.abbrlink || ''
  }

  /**
   * @description Generates a local date and time string
   * @param date A Date object
   */
  localDateTimeString(date: Date = new Date()): string {
    const offsetMs = this.config.timeOffsetInHours * 60 * 60 * 1000
    return new Date(date.getTime() + offsetMs).toISOString().slice(0, 19).replace('T', ' ')
  }

  /**
   * @description Generates a unique abbreviated link for each article
   * @param frontMatter The front matter information of the article
   */
  async abbrLinkHelper(frontMatter: FrontMatter): Promise<string> {
    const formatDate = this.localDateTimeString(frontMatter.date)
    let abbrLink: string
    if (this.config.alg === 'crc32') {
      abbrLink = crc32(frontMatter.title + formatDate).toString(16)
    } else {
      abbrLink = crc16(frontMatter.title + formatDate).toString(16)
    }
    return abbrLink || '0'
  }

  /**
   * @description Generates a unique abbreviated link for each article and updates the front matter information
   * @param value An object containing the content and data of the article
   */
  async generateAbbrLink(
    value: matter.GrayMatterFile<any>,
  ): Promise<{ header: any; value: string }> {
    const frontMatter = value.data as FrontMatter
    const abbrLink = await this.abbrLinkHelper(frontMatter)
    const _frontMatter = { ...frontMatter, abbrlink: abbrLink }
    // Regenerate the file content with the new front matter
    const newFileContent = matter.stringify(value.content || '', _frontMatter, {
      language: 'yaml',
    })

    return { header: _frontMatter, value: newFileContent }
  }
}

export default AbbrLink
