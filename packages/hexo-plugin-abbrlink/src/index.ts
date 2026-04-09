import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function hexoPluginAbbrlink(hexo: any, options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  const plugin = abbrlinkInstance.getHexoPlugin()
  plugin.init(hexo)
}