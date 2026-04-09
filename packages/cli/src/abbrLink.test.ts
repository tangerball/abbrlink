import { describe, it, expect, beforeEach, vi } from 'vitest'
import AbbrLink from './utils/abbrLink'
import matter from 'gray-matter'

vi.mock('gray-matter', () => ({
  default: {
    read: vi.fn(),
    stringify: vi.fn()
  }
}))

describe('AbbrLink', () => {
  let abbrLink: AbbrLink

  beforeEach(() => {
    abbrLink = new AbbrLink()
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should use default configuration', () => {
      const defaultAbbrLink = new AbbrLink()
      expect(defaultAbbrLink).toBeDefined()
    })

    it('should accept custom configuration', () => {
      const customAbbrLink = new AbbrLink({ alg: 'crc16', timeOffsetInHours: 0 })
      expect(customAbbrLink).toBeDefined()
    })
  })

  describe('hasAbbrLink', () => {
    it('should return empty string when no abbrlink', () => {
      const result = abbrLink.hasAbbrLink({})
      expect(result).toBe('')
    })

    it('should return existing abbrlink', () => {
      const result = abbrLink.hasAbbrLink({ abbrlink: 'test123' })
      expect(result).toBe('test123')
    })
  })

  describe('localDateTimeString', () => {
    it('should format date correctly with default offset', () => {
      const date = new Date('2023-01-01T00:00:00Z')
      const result = abbrLink.localDateTimeString(date)
      expect(result).toContain('2023')
    })

    it('should use custom time offset', () => {
      const customAbbrLink = new AbbrLink({ timeOffsetInHours: 0 })
      const date = new Date('2023-01-01T00:00:00Z')
      const result = customAbbrLink.localDateTimeString(date)
      expect(result).toContain('2023')
    })
  })

  describe('abbrLinkHelper', () => {
    it('should generate crc32 abbrlink', async () => {
      const frontMatter = {
        title: 'Test Article',
        date: new Date('2023-01-01T00:00:00Z')
      }
      const result = await abbrLink.abbrLinkHelper(frontMatter)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should generate crc16 abbrlink', async () => {
      const customAbbrLink = new AbbrLink({ alg: 'crc16' })
      const frontMatter = {
        title: 'Test Article',
        date: new Date('2023-01-01T00:00:00Z')
      }
      const result = await customAbbrLink.abbrLinkHelper(frontMatter)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should generate consistent abbrlink for same input', async () => {
      const frontMatter = {
        title: 'Test Article',
        date: new Date('2023-01-01T00:00:00Z')
      }
      const result1 = await abbrLink.abbrLinkHelper(frontMatter)
      const result2 = await abbrLink.abbrLinkHelper(frontMatter)
      expect(result1).toBe(result2)
    })
  })

  describe('generateAbbrLink', () => {
    it('should generate abbrlink and update front matter', async () => {
      const mockMatterFile = {
        data: {
          title: 'Test Article',
          date: new Date('2023-01-01T00:00:00Z')
        },
        content: 'Test content'
      }

      const mockStringifyResult = '---\ntitle: Test Article\ndate: 2023-01-01\nabbrlink: 123abc\n---\nTest content'
      vi.mocked(matter.stringify).mockReturnValue(mockStringifyResult)

      const result = await abbrLink.generateAbbrLink(mockMatterFile as any)
      expect(result.header).toBeDefined()
      expect(result.header.abbrlink).toBeDefined()
      expect(result.value).toBe(mockStringifyResult)
    })
  })
})
