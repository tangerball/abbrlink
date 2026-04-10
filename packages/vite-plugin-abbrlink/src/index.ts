import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function vitePluginAbbrLink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return {
    name: 'vite-plugin-abbrLink',
    async buildStart() {
      await abbrlinkInstance.initMdsSetAbbrLink()
    },
    async configResolved() {
      abbrlinkInstance.watchMdFiles()
    },
    closeBundle() {
      abbrlinkInstance.closeWatcher()
    },
  }
}
