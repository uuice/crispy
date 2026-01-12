import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const client = treaty<App>('http://localhost:4200')

// Example of accessing the API routes
// The API structure is: /api/admin/test (from admin router) and other routes from content router

// Wait for the server to be ready, then make requests
const example = async () => {
  try {
    const htmlResponse = await client.api.admin.test.get()
    console.log('HTML Response:', htmlResponse)

    // Access the admin API route
    // Since the admin router is mounted under /api/admin, the full path would be /api/admin/test
    // Note: The exact path depends on how the routes are structured in your API
    // const adminTestResponse = await client.api.admin.test.get()
    // console.log('Admin Test Response:', adminTestResponse)

    // Add more API calls as needed
    // const text2 = await client.api...
  } catch (error) {
    console.error('Error calling API:', error)
  }
}

example()
