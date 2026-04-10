import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

const remixPlugin = (options: Options) => {
  const abbrlinkInstance = createAbbrlink(options)
  return {
    name: 'remix-plugin-abbrlink',
    async buildStart() {
      await abbrlinkInstance.initMdsSetAbbrLink()
    },
  }
}

export function withAbbrlink(remixConfig: any, options: Options) {
  const plugin = remixPlugin(options)
  
  if (!remixConfig.plugins) {
    remixConfig.plugins = []
  }
  
  remixConfig.plugins.push(plugin)
  return remixConfig
}

export default function remixPluginAbbrlink(options: Options) {
  return remixPlugin(options)
}