# Scripts

This directory contains various utility scripts for the project.

## Available Scripts

### clean-empty-dirs.sh

This script removes all empty directories in the project. It's useful for cleaning up the project structure after development or when encountering issues with stale directories.

#### Usage

```bash
# Run using bun
bun scripts/clean-empty-dirs.sh

# Or run directly
bash scripts/clean-empty-dirs.sh

# Or use the bun script
bun run clean:empty-dirs
```

The script will:

1. Identify all empty directories in the project
2. Remove them recursively
3. Print a completion message
