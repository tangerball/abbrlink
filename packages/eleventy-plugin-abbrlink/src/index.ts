import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function eleventyPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return abbrlinkInstance.getEleventyPlugin()
}