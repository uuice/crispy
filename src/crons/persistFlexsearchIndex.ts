// Persist FlexSearch indexes every 10 minutes
import { flexsearchService } from '../server/services/flexsearch-index.service'

setInterval(
  async () => {
    await flexsearchService.persistAll()
    console.log('[FlexSearch] Periodic persistAll() completed')
  },
  5 * 60 * 1000
)
