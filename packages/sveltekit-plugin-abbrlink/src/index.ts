import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function sveltekitPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return {
    name: 'sveltekit-plugin-abbrlink',
    async handle({ event, resolve }: any) {
      await abbrlinkInstance.initMdsSetAbbrLink()
      abbrlinkInstance.watchMdFiles()
      
      process.on('exit', abbrlinkInstance.closeWatcher)
      
      return resolve(event)
    },
  }
}