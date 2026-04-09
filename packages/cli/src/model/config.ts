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
