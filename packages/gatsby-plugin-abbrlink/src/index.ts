import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function gatsbyPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return abbrlinkInstance.getGatsbyPlugin()
}