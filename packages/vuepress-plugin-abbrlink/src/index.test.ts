import { describe, it, expect, vi } from 'vitest'
import vuepressPluginAbbrlink from './index'
import createAbbrlink from 'abbrlink'

vi.mock('abbrlink', () => ({
  default: vi.fn(() => ({
    getVuePressPlugin: vi.fn(() => ({
      name: 'vuepress-plugin-abbrlink',
      onInitialized: vi.fn(),
      extendsMarkdown: vi.fn()
    }))
  }))
}))

describe('vuepressPluginAbbrlink', () => {
  it('should be defined', () => {
    expect(vuepressPluginAbbrlink).toBeDefined()
    expect(typeof vuepressPluginAbbrlink).toBe('function')
  })

  it('should create plugin with correct structure', () => {
    const options = { paths: '**/*.md' }
    const plugin = vuepressPluginAbbrlink(options)
    expect(plugin).toBeDefined()
    expect(createAbbrlink).toHaveBeenCalledWith(options)
  })
})
