/**
 * @description:  Abbreviated link configuration
 */
export interface AbbrLinkConfig {
  /**
   * @description:  Algorithm
   * @default 'crc32'
   */
  alg: 'crc32' | 'crc16'
}

export interface FrontMatter {
  /**
   * @description:  Title of the article
   */
  title: string
  /**
   * @description:  Date of the article
   */
  date: Date
  [k: string]: any
}
