#!/bin/bash

# Helper script to run common bun commands
# This can help if you're having PATH or environment issues

echo "🚀 Running bun commands for React Vite SPA..."
echo "Current directory: $(pwd)"
echo "Bun version: $(bun --version)"
echo ""

case "$1" in
  "dev")
    echo "Starting development server..."
    bun run dev
    ;;
  "build")
    echo "Building for production..."
    bun run build
    ;;
  "test")
    echo "Running tests..."
    bun run test
    ;;
  "install")
    echo "Installing dependencies..."
    bun install
    ;;
  "check")
    echo "Checking TypeScript..."
    bun run tsc --noEmit
    ;;
  *)
    echo "Available commands:"
    echo "  ./run.sh dev      - Start development server"
    echo "  ./run.sh build    - Build for production"
    echo "  ./run.sh test     - Run tests"
    echo "  ./run.sh install  - Install dependencies"
    echo "  ./run.sh check    - Check TypeScript"
    echo ""
    echo "Or run bun commands directly:"
    echo "  bun run dev"
    echo "  bun run build"
    echo "  bun install"
    ;;
esac
