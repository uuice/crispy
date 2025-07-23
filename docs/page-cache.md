# Page Cache System

## Overview

The page cache system has been refactored to use `cacheService.ts` instead of in-memory Map storage. This provides better persistence, cross-instance sharing, and management capabilities.

## Architecture

### Two-Level Cache System

1. **Memory Cache (L1)**: Fast access for frequently requested pages
   - TTL: 30 seconds (shorter than database cache)
   - Automatically cleaned up every 5 minutes
   - Lost on server restart

2. **Database Cache (L2)**: Persistent storage for all cached pages
   - TTL: Configurable via `PAGE_CACHE_TTL` environment variable (default: 60 seconds)
   - Survives server restarts
   - Can be shared across multiple server instances

### Cache Flow

1. Check memory cache first (fastest)
2. If miss, check database cache
3. If miss, generate response and cache in both memory and database
4. Update memory cache when database cache is hit

## Configuration

### Environment Variables

```bash
# Page cache TTL in seconds (default: 60)
PAGE_CACHE_TTL=60
```

## API Endpoints

### Cache Statistics

```http
GET /admin/page-cache/stats
```

Returns comprehensive cache statistics including memory and database cache info.

### Memory Cache Management

```http
# Get memory cache keys
GET /admin/page-cache/memory/keys

# Clear all memory cache
DELETE /admin/page-cache/memory

# Clean up expired memory cache entries
POST /admin/page-cache/memory/cleanup
```

### Database Cache Management

```http
# Clean up expired database cache entries
POST /admin/page-cache/database/cleanup

# Delete specific cache by hash
DELETE /admin/page-cache/:hash
```

## Cache Headers

The middleware adds cache status headers to responses:

- `X-Page-Cache: HIT-MEMORY` - Cache hit from memory
- `X-Page-Cache: HIT-DB` - Cache hit from database
- No header - Cache miss

## Benefits of Using cacheService

### 1. Persistence

- Cache survives server restarts
- No data loss during deployments

### 2. Cross-Instance Sharing

- Multiple server instances can share cache
- Better for load-balanced environments

### 3. Management Capabilities

- View cache statistics
- Monitor cache hit rates
- Clean up expired entries
- Delete specific caches

### 4. Monitoring

- Track cache performance
- Identify cache patterns
- Optimize cache TTL settings

### 5. Scalability

- Database can handle large amounts of cache data
- No memory limitations
- Automatic cleanup of expired entries

## Performance Considerations

### Memory Cache

- Provides sub-millisecond access for hot pages
- Reduces database queries
- Automatically managed with cleanup

### Database Cache

- Slightly slower than memory but still fast
- Persistent across restarts
- Can be optimized with database indexes

## Monitoring

Use the provided API endpoints to monitor cache performance:

1. **Cache Hit Rate**: Compare memory vs database hits
2. **Cache Size**: Monitor memory and database cache sizes
3. **Cleanup Efficiency**: Track expired entry cleanup

## Best Practices

1. **Set Appropriate TTL**: Balance freshness with performance
2. **Monitor Memory Usage**: Memory cache should not grow too large
3. **Regular Cleanup**: Database cache cleanup prevents bloat
4. **Cache Key Strategy**: Use consistent hashing for cache keys

## Migration from Old System

The new system is backward compatible. Existing cache entries will be automatically migrated as they are accessed. No manual migration is required.
