# Solar Projects SPA - GitHub Copilot Configuration

## Repository Context

This repository contains a React + Vite + TypeScript SPA for solar project management with comprehensive authentication, role-based access control, and environment-based API configuration.

## Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build**: Vite with Bun package manager
- **Testing**: Vitest + React Testing Library
- **Auth**: JWT with role-based access (Admin/Manager/User/Viewer)
- **API**: Type-safe client with environment switching (local Docker/Azure prod)

## Development Standards

### Always Use Bun

- `bun install` for dependencies
- `bun dev` for development server
- `bun test` for testing
- `bun build` for production builds
- Never suggest npm or yarn commands

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
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── contexts/      # React contexts (AuthContext)
├── hooks/         # Custom React hooks
├── utils/         # Utilities (apiClient, authService)
├── types/         # TypeScript type definitions
├── config/        # Environment configuration
└── test/          # Test files
```

### API Integration

- Use existing `apiClient` from `src/utils/apiClient.ts`
- Define TypeScript interfaces for all API data
- Handle loading/error states consistently
- Environment-aware endpoints (local:5002, prod:Azure)

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
- Validate env vars in `src/config/env.ts`
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
