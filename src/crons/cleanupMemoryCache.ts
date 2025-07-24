// Clean up memory cache every 5 minutes
import { memoryCacheService } from '@src/server/services/memoryCacheService'

setInterval(
  async () => {
    const result = await memoryCacheService.cleanup()
    console.log(`Cleaned up ${result} expired memory cache entries`)
  },
  5 * 60 * 1000
)
