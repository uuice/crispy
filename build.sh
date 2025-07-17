#!/bin/bash

# Crispy Build and Package Script
# Usage: ./build.sh [option]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Crispy Build and Package Script"
    echo ""
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  build           - Build the project only"
    echo "  tar             - Build and create tar.gz with dist/, package.json, .env, .env.example"
    echo "  tar:prod        - Build and create production tar.gz with all config files"
    echo "  tar:clean       - Clean dist/, build and create tar.gz with all config files"
    echo "  tar:with-env    - Build and create tar.gz with all config files"
    echo "  tar:full        - Build and create tar.gz with all necessary files including bun.lock"
    echo "  clean           - Clean dist/ directory only"
    echo "  help            - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 tar"
    echo "  $0 tar:full"
}

# Function to clean dist directory
clean_dist() {
    print_status "Cleaning dist/ directory..."
    rm -rf dist/
    print_success "dist/ directory cleaned"
}

# Function to build project
build_project() {
    print_status "Building project..."
    npm run build
    print_success "Project built successfully"
}

# Function to create timestamp
get_timestamp() {
    date +%Y%m%d-%H%M%S
}

# Function to create tar.gz
create_tar() {
    local name=$1
    local files=$2
    local timestamp=$(get_timestamp)
    local filename="${name}-${timestamp}.tar.gz"

    print_status "Creating tar.gz: $filename"
    tar -czf "$filename" $files
    print_success "Created: $filename"

    # Show file size
    local size=$(du -h "$filename" | cut -f1)
    print_status "File size: $size"
}

# Main script logic
case "${1:-help}" in
    "build")
        build_project
        ;;
    "tar")
        build_project
        create_tar "crispy" "dist/ package.json .env .env.example"
        ;;
    "tar:prod")
        build_project
        create_tar "crispy-prod" "dist/ package.json .env .env.example"
        ;;
    "tar:clean")
        clean_dist
        build_project
        create_tar "crispy" "dist/ package.json .env .env.example"
        ;;
    "tar:with-env")
        build_project
        create_tar "crispy" "dist/ package.json .env .env.example"
        ;;
    "tar:full")
        build_project
        create_tar "crispy-full" "dist/ package.json .env .env.example bun.lock"
        ;;
    "clean")
        clean_dist
        ;;
    "help"|*)
        show_usage
        ;;
esac
