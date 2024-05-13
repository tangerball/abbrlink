import { AbbrLinkConfig } from './abbrLink'

export interface Options extends AbbrLinkConfig {
  /**
   * @description: The file of the article
   */
  paths: string | string[]
}
