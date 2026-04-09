import { describe, it, expect, vi } from 'vitest'
import vitePluginAbbrLink from './index'
import createAbbrlink from 'abbrlink'

vi.mock('abbrlink', () => ({
  default: vi.fn(() => ({
    getVitePlugin: vi.fn(() => ({
      name: 'vite-plugin-abbrLink',
      buildStart: vi.fn(),
      configResolved: vi.fn(),
      closeBundle: vi.fn()
    }))
  }))
}))

describe('vitePluginAbbrLink', () => {
  it('should be defined', () => {
    expect(vitePluginAbbrLink).toBeDefined()
    expect(typeof vitePluginAbbrLink).toBe('function')
  })

  it('should create plugin with correct structure', () => {
    const options = { paths: '**/*.md' }
    const plugin = vitePluginAbbrLink(options)
    expect(plugin).toBeDefined()
    expect(createAbbrlink).toHaveBeenCalledWith(options)
  })

  it('should return plugin from abbrlink instance', () => {
    const options = { paths: '**/*.md' }
    const plugin = vitePluginAbbrLink(options)
    expect(plugin).toBeDefined()
  })
})
