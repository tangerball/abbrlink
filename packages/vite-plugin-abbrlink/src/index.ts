import { ResolvedConfig } from 'vite'
import abbrlink, { Options } from 'abbrlink'

export default function vitePluginAbbrLink(options: Options) {
  const { initMdsSetAbbrLink, watchMdFiles, closeWatcher } = abbrlink(options)

  return {
    name: 'vite-plugin-abbrLink',
    async buildStart() {
      await initMdsSetAbbrLink()
    },
    async configResolved(_config: ResolvedConfig) {
      await watchMdFiles()
    },
    closeBundle() {
      closeWatcher()
    },
  }
}
