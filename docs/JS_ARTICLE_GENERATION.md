# JavaScript Article Generation Configuration

This document describes how to configure the automatic JavaScript article generation feature.

## Environment Variables

### ENABLE_JS_ARTICLE_GENERATION

- **Type**: `string`
- **Default**: `'false'`
- **Description**: Enable or disable the JavaScript article generation feature
- **Values**:
  - `'true'` - Enable the feature
  - `'false'` - Disable the feature (default)

### JS_ARTICLE_GENERATION_INTERVAL

- **Type**: `string` (milliseconds)
- **Default**: `'7200000'` (2 hours)
- **Description**: Set the interval between article generations in milliseconds
- **Examples**:
  - `'3600000'` - 1 hour
  - `'7200000'` - 2 hours (default)
  - `'14400000'` - 4 hours
  - `'86400000'` - 24 hours

## Usage Examples

### Enable with default 2-hour interval

```bash
export ENABLE_JS_ARTICLE_GENERATION=true
```

### Enable with custom 1-hour interval

```bash
export ENABLE_JS_ARTICLE_GENERATION=true
export JS_ARTICLE_GENERATION_INTERVAL=3600000
```

### Disable the feature

```bash
export ENABLE_JS_ARTICLE_GENERATION=false
# or simply don't set the variable (defaults to false)
```

## How It Works

1. When `ENABLE_JS_ARTICLE_GENERATION` is set to `'true'`, the system will:
   - Load the `generateJSArticles` module dynamically
   - Execute the article generation immediately on startup
   - Schedule subsequent executions based on the `JS_ARTICLE_GENERATION_INTERVAL`

2. When `ENABLE_JS_ARTICLE_GENERATION` is set to `'false'` or not set:
   - The feature is completely disabled
   - No articles will be generated automatically
   - The module will not be loaded

## Logging

The system provides detailed logging for the article generation process:

- **Enabled**: `[JS Article Generator] Enabled with interval: 7200000ms (120 minutes)`
- **Disabled**: `[JS Article Generator] Disabled by environment variable ENABLE_JS_ARTICLE_GENERATION`
- **Error**: `[JS Article Generator] Failed to load: [error details]`

## Notes

- The interval is specified in milliseconds for maximum flexibility
- The feature uses dynamic imports to avoid loading the module when disabled
- Articles are generated with AI assistance using OpenAI service (if configured)
- Generated articles are automatically published with status 10
- The feature respects the existing OpenAI service configuration
