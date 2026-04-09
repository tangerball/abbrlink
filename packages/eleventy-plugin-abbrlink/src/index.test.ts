import { describe, it, expect, vi } from 'vitest'
import eleventyPluginAbbrlink from './index'
import createAbbrlink from 'abbrlink'

vi.mock('abbrlink', () => ({
  default: vi.fn(() => ({
    getEleventyPlugin: vi.fn(() => ({
      name: 'eleventy-plugin-abbrlink',
      init: vi.fn()
    }))
  }))
}))

describe('eleventyPluginAbbrlink', () => {
  it('should be defined', () => {
    expect(eleventyPluginAbbrlink).toBeDefined()
    expect(typeof eleventyPluginAbbrlink).toBe('function')
  })

  it('should create plugin with correct structure', () => {
    const options = { paths: '**/*.md' }
    const plugin = eleventyPluginAbbrlink(options)
    expect(plugin).toBeDefined()
    expect(createAbbrlink).toHaveBeenCalledWith(options)
  })
})
