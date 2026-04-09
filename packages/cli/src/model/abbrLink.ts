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
