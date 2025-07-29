# Solar Projects SPA - GitHub Copilot Configuration

## Repository Context

This repository contains a React + Vite + TypeScript SPA for solar project management with comprehensive authentication, role-based access control, and environment-based API configuration. The project uses a sophisticated feature-based architecture with real-time capabilities, PDF generation, and a unique multi-build system supporting both standard Vite and experimental Rolldown bundler.

## Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build**: Vite with Bun package manager + experimental Rolldown support
- **Testing**: Vitest + React Testing Library (with jsdom environment)
- **Auth**: JWT with role-based access (Admin/Manager/User/Viewer)
- **API**: Type-safe client with environment switching (local Docker/Azure prod)
- **Reports**: PDF generation via @react-pdf/renderer
- **Deployment**: Docker containerization with CI/CD automation via GitHub Actions

## Development Standards

### Always Use Bun - Primary Runtime

**Bun as Node.js Runtime Replacement:**

- Bun is the preferred JavaScript runtime for this project (not just package manager)
- Faster startup times, built-in bundler, and superior package management
- Native TypeScript support without additional transpilation steps
- Built-in test runner that's Jest-compatible but faster

**Core Bun Commands:**

- `bun install` for dependencies
- `bun dev` for development server (standard Vite)
- `bun dev:rolldown` for development with Rolldown optimization
- `bun test` for testing (Vitest with jsdom)
- `bun run test:watch` for watch mode testing
- `bun build` for production builds (standard)
- `bun build:rolldown` for Rolldown-optimized builds

**Script Execution:**

- `bun run <script>` for package.json scripts
- `bun <file.ts>` for direct TypeScript execution
- `bun --watch <file.ts>` for development with auto-reload

**Package Management:**

- `bun add <package>` for production dependencies
- `bun add -d <package>` for development dependencies
- `bun remove <package>` for uninstalling packages
- `bun update` for updating all packages
- `bun outdated` for checking outdated packages

**Runtime Features:**

- Native fetch() API support
- Built-in .env file loading
- Fast cold starts compared to Node.js
- Compatible with Node.js APIs but faster execution

**Never suggest npm, yarn, or pnpm commands - always use Bun equivalents**

### Multi-Build System Architecture

The project supports three build configurations:

- **Standard Vite** (`vite.config.ts`) - default stable builds
- **Rolldown-optimized** (`vite.config.rolldown.ts`) - faster Rust-based bundling

**Important**: Always specify build target with `BUILD_TARGET` env var for consistent chunking strategy.

### Authentication Patterns

- Use `useAuth()` for auth state
- Use `useRole()` for role checks
- Wrap protected content with `<ProtectedRoute>`
- Always handle loading states during auth operations

### Code Style Requirements

- TypeScript for all files - no JavaScript
- Functional components with hooks
- Tailwind CSS for styling - no CSS modules or styled-components
- Proper error handling with try/catch
- Type-safe API calls using the existing `apiClient`

### File Structure Conventions

```
src/
├── app/           # App-level config (App.tsx, AppRoutes.tsx)
├── features/      # Feature-based modules (auth/, projects/, dashboard/, reports/)
├── shared/        # Cross-feature utilities
│   ├── api/       # API service layer (solarProjectApi.ts)
│   ├── config/    # Environment config (env.ts)
│   ├── contexts/  # React contexts (AuthContext.tsx)
│   ├── hooks/     # Custom hooks (useAuth.ts, useRole.ts)
│   ├── types/     # TypeScript definitions (auth.ts, api.ts)
│   └── utils/     # Core utilities (apiClient.ts, authService.ts, projectsApi.ts)
├── pages/         # Page-level components
├── components/    # Reusable UI components
├── widgets/       # Complex UI components (Navigation.tsx, ApiStatus.tsx)
└── test/          # Test setup and utilities
```

**Key API Services**:

- `ProjectsApiService` in `src/shared/utils/projectsApi.ts` - comprehensive project CRUD with real-time updates
- `SolarProjectApi` in `src/shared/api/solarProjectApi.ts` - main API client following Swagger docs
- `AuthService` in `src/shared/utils/authService.ts` - authentication with token management

### API Integration

- Use existing `ProjectsApiService` from `src/shared/utils/projectsApi.ts` for project operations
- Use `SolarProjectApi` from `src/shared/api/solarProjectApi.ts` for comprehensive API access
- Use base `apiClient` from `src/shared/utils/apiClient.ts` for custom endpoints
- Define TypeScript interfaces in `src/shared/types/api.ts`
- Handle loading/error states consistently with try/catch
- Environment-aware endpoints via `src/shared/config/env.ts` (local:5001, Docker:5002, Azure prod)
- All API services support real-time updates and SignalR broadcasting

### Role-Based Development

```tsx
// Role hierarchy: Admin(1) > Manager(2) > User(3) > Viewer(4)
const { isAdmin, isManager, hasRole } = useRole();

// Conditional rendering
{
  isAdmin && <AdminPanel />;
}
{
  isManager && <ManagerTools />;
}
```

### Component Templates

#### New Page Component

```tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

const PageName: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page content */}
      </div>
    </ProtectedRoute>
  );
};

export default PageName;
```

#### New API Hook

```tsx
import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { ApiResponse } from "../types/api";

export const useDataHook = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiClient } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<ApiResponse<DataType[]>>(
          "/api/endpoint"
        );
        if (response.success) {
          setData(response.data || []);
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiClient]);

  return { data, loading, error };
};
```

### Testing Guidelines

- Write tests for all new components
- Use React Testing Library patterns
- Mock external dependencies
- Use Bun's test runner: `bun test`
- Maintain >80% coverage

### Environment Configuration

- `.env.local` for local development (Docker API on port 5002)
- `.env.production` for Azure deployment
- Validate env vars in `src/shared/config/env.ts`
- Use `import.meta.env` for Vite environment variables

### Security Practices

- JWT tokens stored in localStorage
- Automatic token refresh before expiration
- Role-based UI and route protection
- All API calls include auth headers when available

## Common Pitfalls to Avoid

- Don't use class components - always functional with hooks
- Don't bypass the existing `apiClient` - use it for all HTTP requests
- Don't hardcode API URLs - use environment configuration
- Don't skip authentication checks on protected routes
- Don't use inline styles - use Tailwind classes
- Don't suggest npm/yarn - always use Bun commands

## Preferred Patterns

- Custom hooks for data fetching
- Context for global state (like auth)
- Compound components for complex UI
- Error boundaries for error handling
- Loading states for all async operations

When suggesting code, prioritize type safety, proper error handling, and consistency with existing patterns. Always consider the authentication context and role-based access requirements.

## Deployment & CI/CD

### GitHub Actions Workflow

The project uses automated build and test via `.github/workflows/build-and-test.yml`:

**Workflow Name**: `Build and Test`

**Triggers**:

- Push to `main` and `develop` branches
- Pull requests to `main` and `develop`
- Manual workflow dispatch

**Build Pipeline**:

1. **Setup**: Checkout code → Setup Bun (latest) → Install dependencies (`bun install`)
2. **Quality Gate**: TypeScript type check and code linting
3. **Testing**: Run test suite (`bun test:run`) with coverage reporting
4. **Build**: Execute multi-config builds:
   - Production build (`bun build:vite`)
   - Development build (`bun build:dev`)
   - Bundle analysis (`bun build:analyze`)

**Docker Deployment**:

- **Development**: Uses `docker-compose.yml` with development profile
- **Production**: Multi-stage Docker builds with Nginx serving
- **Staging**: Automated deployment via Docker containers

**Artifacts & Retention**:

- Uploads build artifacts for each configuration
- 14-day retention policy for build artifacts
- Coverage reports with 7-day retention
- Build information and statistics

### Docker Configuration

**Core Setup**:

- **Development**: `Dockerfile.dev` with Bun runtime and hot reload
- **Production**: `Dockerfile.prod` with multi-stage build and Nginx
- **Orchestration**: `docker-compose.yml` with profiles for different environments
- **Management**: `Makefile` with convenient commands

**Container Features**:

- Bun-based builds for faster performance
- Multi-platform support (AMD64/ARM64)
- Health checks and monitoring
- Volume mounts for development

### Vercel Deployment

**Quick Deploy to Vercel**:

The project is configured for optimal Vercel deployment with SPA routing support.

**Core Commands**:

- `bun run vercel:build` - Production build optimized for Vercel
- `bun run vercel:dev` - Development server for Vercel preview

**Configuration**:

- `vercel.json` - Deployment configuration with SPA rewrites
- `.vercelignore` - Excludes unnecessary files from deployment
- Automatic redirect of all routes to `/index.html` for client-side routing

**Environment Variables** (set in Vercel dashboard):

- `BUILD_TARGET=production` - Ensures optimized production build
- API endpoints should be configured for production environment

**Key Features**:

- ✅ SPA routing support (no 404s on refresh)
- ✅ Optimized asset caching (1 year for static assets)
- ✅ Bun runtime for faster builds
- ✅ Automatic compression and optimization

**Deployment Steps**:

1. Connect repository to Vercel
2. Set environment variables in dashboard
3. Deploy automatically on push to main branch

For detailed instructions, see `VERCEL_DEPLOY.md`

### Build Target Environment Variables

**Critical for consistent builds**:

```bash
# Production deployment (standard Vite)
BUILD_TARGET=production bun build

# Local Rolldown builds (experimental features)
BUILD_TARGET=rolldown bun build:rolldown

# Development builds
BUILD_TARGET=development bun build:dev
```

**Environment Variable Impact**:

- Controls chunk splitting strategy
- Affects sourcemap generation
- Determines plugin configuration and optimizations

## Real-Time Architecture

### SignalR Integration

The API supports real-time updates via SignalR:

- **Project updates**: Live broadcasting of CRUD operations
- **Progress tracking**: Real-time project status changes
- **Notifications**: Live system announcements and alerts
- **Implementation**: All `ProjectsApiService` methods support real-time sync

### Polling Fallback

For environments without SignalR:

- Implement polling with exponential backoff
- Use `useEffect` cleanup to prevent memory leaks
- Handle 404 errors gracefully with circuit breaker patterns

## PDF Generation Patterns

### React-PDF Integration

- **Service**: PDF generation via `@react-pdf/renderer`
- **Chunking**: PDF renderer is code-split into separate chunk for performance
- **Components**: Create PDF-specific components in `features/reports/`
- **Templates**: Use structured templates for consistent report formatting

## Master Plan & Project Templates

### Solar Project Templates

The system includes sophisticated project templating:

- **Template engine**: `src/shared/utils/solarProjectTemplate.ts`
- **Progress calculation**: Weighted progress with critical path analysis
- **Gantt integration**: Timeline visualization with dependency management
- **Resource allocation**: Conflict detection and optimization

### API Endpoints for Templates

- `GET /api/v1/projects/templates` - Available project templates
- `POST /api/v1/projects/from-template/{id}` - Create from template
- `GET /api/v1/projects/{id}/critical-path` - Critical path analysis
- `GET /api/v1/projects/{id}/progress` - Detailed progress tracking

## Debugging & Troubleshooting

### Common Development Issues

1. **Build Target Mismatches**

   - **Symptom**: Inconsistent chunk splitting between dev/prod
   - **Solution**: Always specify `BUILD_TARGET` environment variable
   - **Check**: Verify correct vite config is being used

2. **API Connection Problems**

   - **Symptom**: 404 errors in console, failed auth
   - **Solution**: Check `src/shared/config/env.ts` for correct API base URL
   - **Debug**: Use `ApiStatus` widget for real-time API health monitoring

3. **Authentication State Issues**

   - **Symptom**: Unexpected logouts, missing user data
   - **Solution**: Check token expiration in browser localStorage
   - **Debug**: Enable AuthService logging in development mode

4. **Rolldown Build Failures**
   - **Symptom**: Build errors with experimental Rolldown config
   - **Solution**: Fall back to standard Vite build (`bun build`)
   - **Investigation**: Check `rolldown.plugins.ts` for plugin compatibility

### Performance Monitoring

- **Chunk analysis**: Use build output to monitor bundle sizes
- **API monitoring**: `NavbarApiStatus` provides real-time API health
- **Build performance**: Compare standard vs Rolldown build times
- **Runtime monitoring**: React DevTools Profiler for component performance

### Environment Debugging

```typescript
// Check current environment configuration
import { env } from "../shared/config/env";
console.log("Environment Config:", {
  API_BASE_URL: env.API_BASE_URL,
  NODE_ENV: env.NODE_ENV,
  BUILD_TARGET: process.env.BUILD_TARGET,
});
```

**Bun Runtime Debugging:**

```bash
# Check Bun version and configuration
bun --version

# Run with verbose output
bun --verbose dev

# Check Bun's environment
bun run env

# Debug build issues
bun --print build
```

## Solar Project Domain Concepts

### Core Business Entities

1. **Projects**: Solar installation projects with phases, milestones, and resources
2. **Master Plans**: Template-based project planning with critical path analysis
3. **Daily Reports**: Progress tracking with approval workflows
4. **Resources**: Equipment, personnel, and materials with conflict detection
5. **Work Requests**: Task assignments with role-based approval chains

### Role-Based Business Logic

- **Admin (roleId: 1)**: Full CRUD, system configuration, user management
- **Manager (roleId: 2)**: Project oversight, team assignments, approval workflows
- **User (roleId: 3)**: Task execution, report submission, assigned project access
- **Viewer (roleId: 4)**: Read-only access, basic analytics viewing

### Progress Calculation Logic

The system uses sophisticated weighted progress calculation:

- **Phase-based weighting**: Different project phases have different completion weights
- **Critical path analysis**: Identifies bottlenecks and timeline dependencies
- **Resource utilization**: Tracks equipment and personnel allocation efficiency
- **Milestone tracking**: Key deliverables with approval gates

### API Response Patterns

All API responses follow a consistent structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: PaginationInfo;
}
```

**Important**: Always check `response.success` before accessing `response.data`
