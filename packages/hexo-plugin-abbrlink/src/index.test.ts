import { describe, it, expect, vi } from 'vitest'
import hexoPluginAbbrlink from './index'
import createAbbrlink from 'abbrlink'

vi.mock('abbrlink', () => ({
  default: vi.fn(() => ({
    getHexoPlugin: vi.fn(() => ({
      name: 'hexo-plugin-abbrlink',
      init: vi.fn()
    }))
  }))
}))

describe('hexoPluginAbbrlink', () => {
  it('should be defined', () => {
    expect(hexoPluginAbbrlink).toBeDefined()
    expect(typeof hexoPluginAbbrlink).toBe('function')
  })

  it('should initialize plugin with hexo instance', () => {
    const hexo = { extend: { filter: { register: vi.fn() } } }
    const options = { paths: '**/*.md' }
    hexoPluginAbbrlink(hexo, options)
    expect(createAbbrlink).toHaveBeenCalledWith(options)
  })
})
