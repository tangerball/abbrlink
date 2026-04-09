import { describe, it, expect, vi } from 'vitest'
import createAbbrlink, { ensureArray, normalizePath } from './index'
import fastGlob from 'fast-glob'
import chokidar from 'chokidar'
import { writeFile } from 'fs/promises'

vi.mock('fast-glob')
vi.mock('chokidar')
vi.mock('fs/promises', () => ({
  writeFile: vi.fn()
}))

describe('core functions', () => {
  describe('ensureArray', () => {
    it('should convert single value to array', () => {
      expect(ensureArray('test')).toEqual(['test'])
    })

    it('should return array unchanged', () => {
      expect(ensureArray(['test1', 'test2'])).toEqual(['test1', 'test2'])
    })
  })

  describe('normalizePath', () => {
    it('should remove leading slash', () => {
      expect(normalizePath('/path/to/file')).toBe('path/to/file')
    })

    it('should return path unchanged if no leading slash', () => {
      expect(normalizePath('path/to/file')).toBe('path/to/file')
    })
  })
})

describe('createAbbrlink', () => {
  it('should create abbrlink instance with all methods', () => {
    const abbrlink = createAbbrlink({ paths: '**/*.md' })
    expect(abbrlink).toBeDefined()
    expect(typeof abbrlink.initMdsSetAbbrLink).toBe('function')
    expect(typeof abbrlink.watchMdFiles).toBe('function')
    expect(typeof abbrlink.closeWatcher).toBe('function')
    expect(typeof abbrlink.setAbbrLink).toBe('function')
    expect(typeof abbrlink.getVitePlugin).toBe('function')
    expect(typeof abbrlink.getAstroIntegration).toBe('function')
    expect(typeof abbrlink.getNextjsPlugin).toBe('function')
    expect(typeof abbrlink.getNuxtModule).toBe('function')
    expect(typeof abbrlink.getGatsbyPlugin).toBe('function')
    expect(typeof abbrlink.getHexoPlugin).toBe('function')
    expect(typeof abbrlink.getEleventyPlugin).toBe('function')
    expect(typeof abbrlink.getVuePressPlugin).toBe('function')
    expect(typeof abbrlink.getSvelteKitPlugin).toBe('function')
    expect(typeof abbrlink.getRemixPlugin).toBe('function')
  })

  describe('plugin methods', () => {
    it('should return Vite plugin', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const plugin = abbrlink.getVitePlugin()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('vite-plugin-abbrLink')
      expect(typeof plugin.buildStart).toBe('function')
      expect(typeof plugin.configResolved).toBe('function')
      expect(typeof plugin.closeBundle).toBe('function')
    })

    it('should return Astro integration', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const integration = abbrlink.getAstroIntegration()
      expect(integration).toBeDefined()
      expect(integration.name).toBe('astro-abbrlink')
      expect(integration.hooks).toBeDefined()
    })

    it('should return Next.js plugin', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const plugin = abbrlink.getNextjsPlugin()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('nextjs-abbrlink')
      expect(typeof plugin.module).toBe('function')
    })

    it('should return Nuxt module', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const module = abbrlink.getNuxtModule()
      expect(module).toBeDefined()
      expect(module.name).toBe('nuxt-abbrlink')
      expect(typeof module.setup).toBe('function')
    })

    it('should return Gatsby plugin', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const plugin = abbrlink.getGatsbyPlugin()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('gatsby-plugin-abbrlink')
      expect(typeof plugin.onPreBootstrap).toBe('function')
      expect(typeof plugin.onCreateNode).toBe('function')
    })

    it('should return Hexo plugin', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const plugin = abbrlink.getHexoPlugin()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('hexo-plugin-abbrlink')
      expect(typeof plugin.init).toBe('function')
    })

    it('should return Eleventy plugin', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const plugin = abbrlink.getEleventyPlugin()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('eleventy-plugin-abbrlink')
      expect(typeof plugin.init).toBe('function')
    })

    it('should return VuePress plugin', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const plugin = abbrlink.getVuePressPlugin()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('vuepress-plugin-abbrlink')
      expect(typeof plugin.onInitialized).toBe('function')
      expect(typeof plugin.extendsMarkdown).toBe('function')
    })

    it('should return SvelteKit plugin', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const plugin = abbrlink.getSvelteKitPlugin()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('sveltekit-plugin-abbrlink')
      expect(typeof plugin.handle).toBe('function')
    })

    it('should return Remix plugin', () => {
      const abbrlink = createAbbrlink({ paths: '**/*.md' })
      const plugin = abbrlink.getRemixPlugin()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('remix-plugin-abbrlink')
      expect(typeof plugin.buildStart).toBe('function')
    })
  })
})
