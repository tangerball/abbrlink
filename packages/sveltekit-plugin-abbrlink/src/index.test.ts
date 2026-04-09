import { describe, it, expect, vi } from 'vitest'
import sveltekitPluginAbbrlink from './index'
import createAbbrlink from 'abbrlink'

vi.mock('abbrlink', () => ({
  default: vi.fn(() => ({
    getSvelteKitPlugin: vi.fn(() => ({
      name: 'sveltekit-plugin-abbrlink',
      handle: vi.fn()
    }))
  }))
}))

describe('sveltekitPluginAbbrlink', () => {
  it('should be defined', () => {
    expect(sveltekitPluginAbbrlink).toBeDefined()
    expect(typeof sveltekitPluginAbbrlink).toBe('function')
  })

  it('should create plugin with correct structure', () => {
    const options = { paths: '**/*.md' }
    const plugin = sveltekitPluginAbbrlink(options)
    expect(plugin).toBeDefined()
    expect(createAbbrlink).toHaveBeenCalledWith(options)
  })
})
