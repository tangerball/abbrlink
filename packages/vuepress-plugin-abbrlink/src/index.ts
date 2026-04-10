import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function vuepressPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return {
    name: 'vuepress-plugin-abbrlink',
    onInitialized() {
      abbrlinkInstance.initMdsSetAbbrLink()
    },
    extendsMarkdown(md: any) {
      const defaultRender = md.render
      md.render = async (src: string, env: any) => {
        if (env.filePath && env.filePath.endsWith('.md')) {
          await abbrlinkInstance.setAbbrLink(env.filePath)
        }
        return defaultRender(src, env)
      }
    },
  }
}