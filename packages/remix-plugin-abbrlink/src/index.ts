import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export function withAbbrlink(remixConfig: any, options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  const plugin = abbrlinkInstance.getRemixPlugin()
  
  // Add the plugin to the Remix config
  if (!remixConfig.plugins) {
    remixConfig.plugins = []
  }
  
  remixConfig.plugins.push(plugin)
  return remixConfig
}

export default function remixPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return abbrlinkInstance.getRemixPlugin()
}