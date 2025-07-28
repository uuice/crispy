# Static Generation System

## Overview

The static generation system allows you to pre-generate all website pages as static HTML files, providing significant performance improvements and reducing server load.

## Features

- **Full Site Static Generation**: Generate all pages as static HTML files
- **Admin Interface**: One-click static generation from the admin panel
- **Automatic File Management**: Clean and organize static files
- **Performance Monitoring**: Track generation statistics and file sizes
- **Flexible Configuration**: Customize generation settings via environment variables

## Architecture

### Static File Structure

```
temp/static/
├── index.html                    # Home page
├── archives/
│   ├── index.html               # Archives list page
│   └── [article-url]/
│       └── index.html           # Individual article pages
├── about/
│   └── index.html               # About page
├── links/
│   └── index.html               # Links page
├── daily-lib/
│   └── index.html               # Daily lib page
├── categories/
│   └── [category-alias]/
│       └── index.html           # Category pages
├── tags/
│   └── [tag-name]/
│       └── index.html           # Tag pages
└── pages/
    └── [page-url]/
        └── index.html           # Custom pages
```

### Server Integration

The server automatically serves static files when available:

1. **Static File Check**: Server checks if static file exists in `temp/static/`
2. **Fallback to SSR**: If no static file exists, falls back to Angular SSR
3. **Performance**: Static files are served with 1-year cache headers

## Usage

### 1. Admin Panel Generation

1. Navigate to **Settings** page in admin panel
2. Click **"重新生成静态页面"** button
3. Wait for generation to complete
4. View generation statistics and status

### 2. Command Line Generation

```bash
# Generate static pages (requires server to be running)
bun run generate:static

# Build and generate static pages
bun run build:static

# Clean build and generate static pages
bun run build:static:clean
```

### 3. Environment Variables

```bash
# Enable static generation
STATIC_GENERATION_ENABLED=true

# Base URL for static generation (default: http://localhost:4000)
STATIC_GENERATION_BASE_URL=http://localhost:4000

# Admin token for API access
ADMIN_TOKEN=your-admin-token
```

## API Endpoints

### Generate Static Pages

```http
POST /api/admin/static-generation/generate
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Static generation completed successfully. Generated 150 files.",
    "generatedFiles": ["index.html", "archives/article1/index.html", ...],
    "totalPages": 5,
    "totalArticles": 100,
    "totalCategories": 10,
    "totalTags": 35,
    "errors": []
  }
}
```

### Get Generation Status

```http
GET /api/admin/static-generation/status
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "staticDirExists": true,
    "fileCount": 150,
    "totalSize": "2.5 MB",
    "lastGenerated": "2024-01-15T10:30:00.000Z",
    "staticDir": "/path/to/temp/static"
  }
}
```

## Performance Benefits

### Before Static Generation

- **Server Load**: High - every request requires SSR processing
- **Response Time**: 200-500ms per page
- **Concurrent Users**: Limited by server capacity
- **Database Load**: High - queries on every request

### After Static Generation

- **Server Load**: Minimal - static file serving only
- **Response Time**: 10-50ms per page
- **Concurrent Users**: Unlimited - static file serving
- **Database Load**: Zero - no queries for static pages

## Configuration

### Server Configuration

The server automatically serves static files from `temp/static/` directory:

```typescript
// Serve static generated pages from temp directory
app.use(
  '/static',
  express.static(join(process.cwd(), 'temp', 'static'), {
    maxAge: '1y',
    index: false,
    redirect: false
  })
)

// Static page handler - serve static HTML files from temp directory
app.get('*', (req, res, next) => {
  // Skip API routes, admin routes, and other non-page routes
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/admin') ||
    req.path.startsWith('/backstage') ||
    req.path.startsWith('/uploads') ||
    req.path.startsWith('/doc') ||
    req.path.startsWith('/static') ||
    req.path.match(/\.(js|css|png|jpg|ico|svg|json|woff|woff2)$/)
  ) {
    return next()
  }

  // Check if static file exists in temp directory
  const staticPath = join(process.cwd(), 'temp', 'static', req.path, 'index.html')

  if (fs.existsSync(staticPath)) {
    console.log(`📄 Serving static file: ${req.path}`)
    return res.sendFile(staticPath)
  }

  // If no static file, continue to Angular SSR
  next()
})
```

### Generation Process

1. **Start Server**: Launch development server
2. **Fetch Pages**: Request each page via HTTP
3. **Save HTML**: Save rendered HTML to static files
4. **Organize Files**: Create directory structure
5. **Update Status**: Track generation statistics

## Monitoring

### Generation Statistics

- **Total Files**: Number of generated HTML files
- **File Sizes**: Total size of static files
- **Generation Time**: Last generation timestamp
- **Error Tracking**: Failed page generations

### Performance Metrics

- **Cache Hit Rate**: Percentage of requests served from static files
- **Response Times**: Before/after static generation
- **Server Load**: CPU and memory usage reduction

## Troubleshooting

### Common Issues

1. **Generation Fails**
   - Check server is running
   - Verify admin token is correct
   - Check network connectivity

2. **Static Files Not Served**
   - Verify `temp/static/` directory exists
   - Check file permissions
   - Ensure server configuration is correct

3. **Performance Issues**
   - Monitor disk space for static files
   - Check cache headers are set correctly
   - Verify static file serving is enabled

### Debug Commands

```bash
# Check static directory
ls -la temp/static/

# Check generation status
curl -H "Authorization: Bearer <token>" http://localhost:4000/api/admin/static-generation/status

# Test static file serving
curl -I http://localhost:4000/
```

## Best Practices

1. **Regular Generation**: Generate static pages after content updates
2. **Incremental Updates**: Only regenerate changed pages when possible
3. **Monitoring**: Track generation statistics and performance metrics
4. **Backup**: Keep backups of static files for quick recovery
5. **CDN Integration**: Serve static files via CDN for global performance

## Future Enhancements

- **Incremental Generation**: Only regenerate changed pages
- **CDN Integration**: Automatic upload to CDN
- **Scheduled Generation**: Automatic generation on content updates
- **Performance Analytics**: Detailed performance metrics
- **Multi-environment Support**: Different static files for different environments
