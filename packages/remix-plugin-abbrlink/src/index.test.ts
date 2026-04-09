import { describe, it, expect, vi } from 'vitest'
import remixPluginAbbrlink, { withAbbrlink } from './index'
import createAbbrlink from 'abbrlink'

vi.mock('abbrlink', () => ({
  default: vi.fn(() => ({
    getRemixPlugin: vi.fn(() => ({
      name: 'remix-plugin-abbrlink',
      buildStart: vi.fn()
    }))
  }))
}))

describe('remixPluginAbbrlink', () => {
  it('should be defined', () => {
    expect(remixPluginAbbrlink).toBeDefined()
    expect(typeof remixPluginAbbrlink).toBe('function')
  })

  it('should create plugin with correct structure', () => {
    const options = { paths: '**/*.md' }
    const plugin = remixPluginAbbrlink(options)
    expect(plugin).toBeDefined()
    expect(createAbbrlink).toHaveBeenCalledWith(options)
  })
})

describe('withAbbrlink', () => {
  it('should be defined', () => {
    expect(withAbbrlink).toBeDefined()
    expect(typeof withAbbrlink).toBe('function')
  })

  it('should wrap remix config', () => {
    const remixConfig = { adapter: 'adapter' }
    const options = { paths: '**/*.md' }
    const result = withAbbrlink(remixConfig, options)
    expect(result).toBeDefined()
    expect(result.plugins).toBeDefined()
    expect(createAbbrlink).toHaveBeenCalledWith(options)
  })

  it('should add plugins array if not present', () => {
    const remixConfig = { adapter: 'adapter' }
    const options = { paths: '**/*.md' }
    const result = withAbbrlink(remixConfig, options)
    expect(Array.isArray(result.plugins)).toBe(true)
  })
})
