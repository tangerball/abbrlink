import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function hexoPluginAbbrlink(hexo: any, options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  hexo.extend.filter.register('before_post_render', async (data: any) => {
    const filePath = data.source || data.path
    if (filePath) {
      await abbrlinkInstance.setAbbrLink(filePath)
    }
    return data
  })
}