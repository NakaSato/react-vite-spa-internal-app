# Documentation Index

This directory contains comprehensive documentation for the Solar Projects Management SPA.

## 📋 Table of Contents

### API Documentation
- **[Project Management API](api/PROJECT_MANAGEMENT_API.md)** - Enhanced project management with real-time updates, analytics, and role-based access

### Features Documentation
- **[Daily Reports Integration](features/DAILY_REPORTS_INTEGRATION_COMPLETE.md)** - Complete daily reporting system with approval workflows
- **[Registration System](features/REGISTRATION.md)** - User registration and authentication
- **[Real-time Project Management](features/REALTIME_PROJECT_MANAGEMENT.md)** - Live project updates and notifications
- **[Master Plan Integration](features/MASTER_PLAN_INTEGRATION_SUMMARY.md)** - Master plan functionality and API integration
- **[Project Status Overview Pagination](features/PROJECT_STATUS_OVERVIEW_PAGINATION.md)** - Database-driven pagination with search, filtering, and sorting

### Technical Documentation
- **[404 & Protected Routes](404_AND_PROTECTED_ROUTES.md)** - Error handling and route protection
- **[PDF Reports](PDF_REPORTS.md)** - PDF generation and reporting features

### Fixes & Troubleshooting
- **[Real-time Polling 404 Fix](fixes/REALTIME_POLLING_404_FIX.md)** - Original fix for continuous 404 errors
- **[Real-time Polling Enhanced Fix](fixes/REALTIME_POLLING_ENHANCED_FIX.md)** - Enhanced solution for preventing 404 errors

### Archive
- **[Master Plan Project Overview](archive/MASTER_PLAN_OF_PROJECT.md)** - Comprehensive master plan specification (archived)

## 🏗️ Architecture Overview

The application follows a feature-based architecture with:

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Bun** as the package manager
- **JWT authentication** with role-based access control
- **Real-time updates** via polling and notifications
- **Environment-based API configuration** (Docker local / Azure production)

## 🔧 Development Guidelines

1. **Always use Bun** - `bun install`, `bun dev`, `bun test`, `bun build`
2. **TypeScript for all files** - No JavaScript files
3. **Functional components with hooks** - No class components
4. **Tailwind CSS for styling** - No CSS modules or styled-components
5. **Feature-based organization** - Components grouped by feature
6. **Type-safe API calls** - Use existing `apiClient`
7. **Proper error handling** - Try/catch blocks and loading states

## 📝 Documentation Standards

- Keep documentation up to date with code changes
- Use clear, descriptive titles and sections
- Include code examples where helpful
- Document breaking changes and migration steps
- Archive completed migration documentation
