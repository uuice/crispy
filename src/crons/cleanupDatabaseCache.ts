// Clean up memory cache every 5 minutes
import { cacheService } from '@src/server/services/cacheService'

setInterval(
  async () => {
    const cleanedCount = await cacheService.clearExpiredCaches()
    console.log(`Cleaned up ${cleanedCount} expired memory cache entries`)
  },
  5 * 60 * 1000
)
