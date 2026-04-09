import { describe, it, expect, vi } from 'vitest'
import gatsbyPluginAbbrlink from './index'
import createAbbrlink from 'abbrlink'

vi.mock('abbrlink', () => ({
  default: vi.fn(() => ({
    getGatsbyPlugin: vi.fn(() => ({
      name: 'gatsby-plugin-abbrlink',
      onPreBootstrap: vi.fn(),
      onCreateNode: vi.fn()
    }))
  }))
}))

describe('gatsbyPluginAbbrlink', () => {
  it('should be defined', () => {
    expect(gatsbyPluginAbbrlink).toBeDefined()
    expect(typeof gatsbyPluginAbbrlink).toBe('function')
  })

  it('should create plugin with correct structure', () => {
    const options = { paths: '**/*.md' }
    const plugin = gatsbyPluginAbbrlink(options)
    expect(plugin).toBeDefined()
    expect(createAbbrlink).toHaveBeenCalledWith(options)
  })
})
