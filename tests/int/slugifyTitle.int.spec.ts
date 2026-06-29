import { describe, expect, it } from 'vitest'

import { slugifyFromTitle } from '@/utilities/slugifyTitle'

describe('slugifyFromTitle', () => {
  it('converts Chinese titles to hyphenated pinyin', () => {
    expect(slugifyFromTitle('全栈工程师')).toBe('quan-zhan-gong-cheng-shi')
  })

  it('keeps English words readable', () => {
    expect(slugifyFromTitle('Hello World')).toBe('hello-world')
    expect(slugifyFromTitle('Payload CMS')).toBe('payload-cms')
  })

  it('handles mixed Chinese and ASCII', () => {
    expect(slugifyFromTitle('Next.js 教程')).toBe('next-js-jiao-cheng')
  })

  it('returns empty string for blank input', () => {
    expect(slugifyFromTitle('   ')).toBe('')
  })
})
