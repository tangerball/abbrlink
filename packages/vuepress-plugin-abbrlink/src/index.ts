import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function vuepressPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return abbrlinkInstance.getVuePressPlugin()
}