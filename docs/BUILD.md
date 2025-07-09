# Crispy Build and Packaging Guide

This guide explains how to build and package the Crispy project using the provided scripts.

## Quick Start

### Using npm scripts (package.json)

```bash
# Build only
npm run build

# Build and create tar.gz with dist/ only
npm run build:tar

# Build and create production tar.gz
npm run build:tar:prod

# Clean dist/, build and create tar.gz
npm run build:tar:clean

# Build and create tar.gz with .env file
npm run build:tar:with-env

# Build and create tar.gz with all necessary files
npm run build:tar:full
```

### Using the build script (build.sh)

```bash
# Show help
./build.sh help

# Build only
./build.sh build

# Build and create tar.gz with dist/ only
./build.sh tar

# Build and create production tar.gz
./build.sh tar:prod

# Clean dist/, build and create tar.gz
./build.sh tar:clean

# Build and create tar.gz with .env file
./build.sh tar:with-env

# Build and create tar.gz with all necessary files
./build.sh tar:full

# Clean dist/ directory only
./build.sh clean
```

## Script Options

### npm scripts

| Script               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `build:tar`          | Build and create tar.gz with dist/ only          |
| `build:tar:prod`     | Build and create production tar.gz               |
| `build:tar:clean`    | Clean dist/, build and create tar.gz             |
| `build:tar:with-env` | Build and create tar.gz with .env file           |
| `build:tar:full`     | Build and create tar.gz with all necessary files |

### build.sh options

| Option         | Description                                      |
| -------------- | ------------------------------------------------ |
| `build`        | Build the project only                           |
| `tar`          | Build and create tar.gz with dist/ only          |
| `tar:prod`     | Build and create production tar.gz               |
| `tar:clean`    | Clean dist/, build and create tar.gz             |
| `tar:with-env` | Build and create tar.gz with .env file           |
| `tar:full`     | Build and create tar.gz with all necessary files |
| `clean`        | Clean dist/ directory only                       |
| `help`         | Show help message                                |

## Package Contents

### `build:tar` / `tar`

- `dist/` - Built application files
- `package.json` - Project dependencies
- `.env` - Environment configuration
- `.env.example` - Environment configuration template

### `build:tar:with-env` / `tar:with-env`

- `dist/` - Built application files
- `package.json` - Project dependencies
- `.env` - Environment configuration
- `.env.example` - Environment configuration template

### `build:tar:full` / `tar:full`

- `dist/` - Built application files
- `package.json` - Project dependencies
- `.env` - Environment configuration
- `.env.example` - Environment configuration template
- `bun.lock` - Lock file for reproducible builds

## File Naming Convention

Generated tar.gz files follow this naming pattern:

```
crispy-YYYYMMDD-HHMMSS.tar.gz
crispy-prod-YYYYMMDD-HHMMSS.tar.gz
crispy-full-YYYYMMDD-HHMMSS.tar.gz
```

Where:

- `YYYYMMDD` = Date (YYYY-MM-DD)
- `HHMMSS` = Time (HH:MM:SS)

## Examples

### Development Build

```bash
# Quick build and package
npm run build:tar

# Or using the script
./build.sh tar
```

### Production Build with Environment

```bash
# Build with environment file
npm run build:tar:with-env

# Or using the script
./build.sh tar:with-env
```

### Complete Package for Deployment

```bash
# Full package with all necessary files
npm run build:tar:full

# Or using the script
./build.sh tar:full
```

## Notes

- The build script includes colored output for better visibility
- All scripts use `set -e` to stop on errors
- File sizes are displayed after creation
- Timestamps are automatically generated
- The `tar:clean` option removes the dist/ directory before building

## Troubleshooting

### Permission Denied

If you get permission denied when running `./build.sh`:

```bash
chmod +x build.sh
```

### Build Fails

If the build fails, check:

1. All dependencies are installed: `npm install`
2. Environment file exists: `.env`
3. Database connection is available
4. Node.js version is compatible

### Tar Creation Fails

If tar creation fails, check:

1. Sufficient disk space
2. Write permissions in current directory
3. Files exist (dist/, .env, etc.)
