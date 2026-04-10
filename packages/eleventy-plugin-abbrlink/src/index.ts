import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function eleventyPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return {
    name: 'eleventy-plugin-abbrlink',
    init(eleventyConfig: any) {
      eleventyConfig.addTransform('abbrlink', async (content: string, outputPath: string) => {
        if (outputPath && outputPath.endsWith('.md')) {
          await abbrlinkInstance.setAbbrLink(outputPath)
        }
        return content
      })
    },
  }
}