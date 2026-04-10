import { Options } from 'abbrlink'
import createAbbrlink from 'abbrlink'

export default function gatsbyPluginAbbrlink(options: Options) {
  const abbrlinkInstance = createAbbrlink(options)
  return {
    name: 'gatsby-plugin-abbrlink',
    async onPreBootstrap() {
      await abbrlinkInstance.initMdsSetAbbrLink()
    },
    async onCreateNode({ node }: any) {
      if (node.internal.type === 'MarkdownRemark') {
        await abbrlinkInstance.setAbbrLink(node.fileAbsolutePath)
      }
    },
  }
}