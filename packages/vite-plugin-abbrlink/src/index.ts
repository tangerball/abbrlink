import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function vitePluginAbbrLink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return abbrlinkInstance.getVitePlugin()
}
