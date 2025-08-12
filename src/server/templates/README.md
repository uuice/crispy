# Templates Build System

This directory contains server-side templates and their associated styles. The build system supports both Tailwind CSS and Less for template styling, with full `@apply` directive support in Less files.

## Directory Structure

```
src/server/templates/
├── styles/
│   ├── style.less         # Main Less file (imports all other .less files)
│   ├── about.less         # About page styles
│   ├── index.less         # Index page styles
│   └── templates-input.css # Tailwind CSS input file
├── demo.html               # Demo template
└── README.md              # This file
```

## Build Commands

### Development

```bash
# Build templates once
bun run templates:build

# Watch mode for development (auto-rebuild on changes)
bun run templates:watch

# Development mode (build + watch)
bun run templates:dev
```

### Production

```bash
# Build for production (minified)
bun run templates:build:prod

# Clean build artifacts
bun run templates:clean
```

## Configuration Files

- `tailwind.templates.config.js` - Tailwind CSS configuration for templates
- `src/server/templates/styles/style.less` - Main Less file (imports all other files)
- `scripts/build-templates.ts` - Build script

## Output Files

Compiled files are output to `public/assets/styles/`:

- `templates.css` - Tailwind CSS output
- `style.css` - Combined Less + @apply output (includes all imported files)
- `style.css.map` - Source map for debugging

## Usage in Templates

### Including Styles in Nunjucks Templates

```njk
<!-- In your .html template files -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/assets/styles/templates.css">
    <link rel="stylesheet" href="/assets/styles/style.css">
</head>
<body>
    <div class="template-container">
        <header class="template-header">
            <h1>Your Template Title</h1>
        </header>

        <nav class="template-nav">
            <!-- Navigation content -->
        </nav>

        <main class="template-content">
            <!-- Main content -->
        </main>

        <footer class="template-footer">
            <!-- Footer content -->
        </footer>
    </div>
</body>
</html>
```

### Using Tailwind Classes

You can use Tailwind CSS classes directly in your templates:

```njk
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Title</h2>
    <p class="text-gray-700">Content goes here</p>
</div>
```

### Using Custom Less Classes

The `templates.less` file provides custom classes:

```njk
<div class="template-container">
    <div class="template-header">
        <h1>Custom styled header</h1>
    </div>

    <div class="template-content">
        <h2>Content with custom styling</h2>
    </div>
</div>
```

### Combining Tailwind and Less Classes

You can combine both Tailwind classes and custom Less classes:

```njk
<!-- Using both Tailwind and custom Less classes -->
<div class="template-card bg-white rounded-lg shadow-md">
    <h3 class="card-title text-xl font-semibold">Card Title</h3>
    <p class="card-content text-gray-600">Card content with custom styling</p>
</div>
```

## Working with Less and Tailwind

### Using @apply Directives in Less

You can use `@apply` directives directly in `templates.less`:

```less
// In templates.less
.template-card {
  @apply bg-white rounded-lg shadow-md p-6 mb-4;
  border: 1px solid @border-color;

  .card-title {
    @apply text-xl font-semibold text-gray-800 mb-2;
  }

  .card-content {
    @apply text-gray-600;
  }

  .card-button {
    @apply bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors;
  }
}

// Responsive design with @apply
.template-grid {
  @apply grid gap-4;

  @media (min-width: 768px) {
    @apply grid-cols-2;
  }

  @media (min-width: 1024px) {
    @apply grid-cols-3;
  }
}
```

### Using Less Variables and Functions

In `templates.less`, you can use Less variables and functions:

```less
// Template-specific variables
@primary-color: #3b82f6;
@secondary-color: #64748b;

.template-button {
  background: @primary-color;
  color: white;

  &:hover {
    background: darken(@primary-color, 10%);
  }
}
```

### Best Practices

1. **Use @apply for Tailwind utilities**: Put `@apply` directives directly in `templates.less`
2. **Use Less for custom logic**: Put variables, mixins, and custom styles in `templates.less`
3. **Combine both when needed**: Use Tailwind classes alongside custom Less classes
4. **Keep styles organized**: Group related styles together

## Development Workflow

1. **Start development mode:**

   ```bash
   bun run templates:dev
   ```

2. **Edit styles:**
   - Modify `src/server/templates/styles/templates.less` for Less styles and @apply directives
   - Use Tailwind classes directly in `.html` files
   - Update `tailwind.templates.config.js` for Tailwind configuration

3. **Files are automatically compiled:**
   - Tailwind CSS → `public/assets/styles/templates.css`
   - Combined Less + @apply → `public/assets/styles/templates.compiled.css`

## Customization

### Adding Tailwind Plugins

Edit `tailwind.templates.config.js`:

```javascript
module.exports = {
  // ... existing config
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
    // Add your custom plugins here
  ]
}
```

### Adding Custom Less Variables

Edit `src/server/templates/styles/templates.less`:

```less
// Add custom variables
@custom-color: #your-color;
@custom-spacing: 2rem;

// Use in your styles
.custom-class {
  color: @custom-color;
  margin: @custom-spacing;

  // Use @apply with Tailwind classes
  @apply bg-white rounded-lg shadow-md;
}
```

## Troubleshooting

### Build Issues

1. **Check dependencies:**

   ```bash
   bun install
   ```

2. **Clean and rebuild:**

   ```bash
   bun run templates:clean
   bun run templates:build
   ```

3. **Check file permissions:**

   ```bash
   chmod +x scripts/build-templates.ts
   ```

### Watch Mode Not Working

1. **Check if files are being watched:**

   ```bash
   bun run templates:watch
   ```

2. **Restart the watcher:**

   ```bash
   # Stop the current process and restart
   bun run templates:dev
   ```

## Integration with Main Build

The templates build system is independent of the main Angular build. To integrate:

1. **Add to main build script:**

   ```bash
   # In your main build process
   bun run templates:build:prod && ng build
   ```

2. **Copy assets to dist:**

   ```bash
   # Ensure compiled CSS files are copied to dist
   cp public/assets/styles/templates*.css dist/crispy/browser/assets/styles/
   ```

## Notes

- The build system uses Bun for fast execution
- Less is compiled first, then @apply directives are processed by Tailwind
- @apply directives are automatically cleaned up (commas removed)
- Source maps are generated in development mode
- Production builds are minified and optimized
- All paths are relative to the project root
- You can use @apply directives directly in `templates.less` files
