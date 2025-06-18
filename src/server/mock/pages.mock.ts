import Mock from 'mockjs'
import { pageService, type CreatePageData } from '../services/pageService'

// Mock data for pages using mockjs
const mockPagesData: CreatePageData[] = Mock.mock({
  'pages|5': [
    {
      title: '@ctitle(5, 10)',
      alias: '@word(5, 10)',
      content: '@cparagraph(3, 7)',
      seo_description: '@csentence(10, 20)',
      seo_keywords: '@word(3, 8)',
      image_list: '@image("300x200", "#50B347", "#FFF", "Mock")',
      'status|1': [10, 0]
    }
  ]
}).pages

// Add specific pages for common use cases
const commonPages: CreatePageData[] = [
  {
    title: 'About Us',
    alias: 'about',
    content: Mock.mock('@cparagraph(5, 10)'),
    seo_description: 'Learn more about our company',
    seo_keywords: 'about, company, mission',
    image_list: '/images/about.jpg',
    status: 10
  },
  {
    title: 'Contact',
    alias: 'contact',
    content: Mock.mock('@cparagraph(3, 6)'),
    seo_description: 'Get in touch with us',
    seo_keywords: 'contact, email, phone',
    image_list: '/images/contact.jpg',
    status: 10
  },
  {
    title: 'Privacy Policy',
    alias: 'privacy',
    content: Mock.mock('@cparagraph(8, 15)'),
    seo_description: 'Our privacy policy',
    seo_keywords: 'privacy, policy, data',
    image_list: '/images/privacy.jpg',
    status: 10
  }
]

// Combine mock data
const allMockPages = [...commonPages, ...mockPagesData]

/**
 * Seed pages data into database using mockjs
 */
export async function seedPagesData(): Promise<void> {
  console.log('🌱 Seeding pages data with mockjs...')

  try {
    let createdCount = 0
    let skippedCount = 0

    for (const pageData of allMockPages) {
      // Check if page already exists by alias
      const existingPage = await pageService.getPageByAlias(pageData.alias)

      if (existingPage) {
        console.log(`⏭️  Page "${pageData.alias}" already exists, skipping...`)
        skippedCount++
        continue
      }

      // Create new page
      const newPage = await pageService.createPage(pageData)
      console.log(`✅ Created page: ${newPage.title} (${newPage.alias})`)
      createdCount++
    }

    console.log(`🎉 Pages seeding completed! Created: ${createdCount}, Skipped: ${skippedCount}`)
  } catch (error) {
    console.error('❌ Error seeding pages data:', error)
    throw error
  }
}

// Export mock data for reference
export { allMockPages as mockPagesData }
