#!/bin/bash

# Vercel Deployment Setup Script
# This script helps you set up your Rolldown-optimized React SPA for Vercel deployment

echo "🚀 Setting up Vercel deployment for Rolldown-optimized React SPA..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ Bun is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git not initialized. Initializing...${NC}"
    git init
    git add .
    git commit -m "Initial commit with Rolldown configuration"
fi

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    bun add -g vercel
fi

# Build the project to ensure it works
echo -e "${YELLOW}🔨 Building project with Rolldown...${NC}"
bun build:vercel

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Login to Vercel
echo -e "${YELLOW}🔐 Please login to Vercel...${NC}"
vercel login

# Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
vercel --prod

echo -e "${GREEN}✅ Deployment setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Configure custom domain if needed"
echo "3. Set up GitHub integration for automatic deployments"
echo "4. Monitor performance in Vercel dashboard"
echo ""
echo "🔧 Available commands:"
echo "  bun dev:vercel     - Development with Vercel optimizations"
echo "  bun build:vercel   - Build with Vercel optimizations"
echo "  bun build:rolldown - Build with Rolldown optimizations"
echo "  vercel --prod      - Deploy to production"
echo "  vercel             - Deploy to preview"
echo ""
echo "📚 Documentation:"
echo "  - VERCEL_DEPLOYMENT.md - Deployment guide"
echo "  - ROLLDOWN_MIGRATION.md - Rolldown setup guide"
echo ""
echo -e "${GREEN}🎉 Your Rolldown-optimized React SPA is now deployed on Vercel!${NC}"
