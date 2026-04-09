import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function sveltekitPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return abbrlinkInstance.getSvelteKitPlugin()
}