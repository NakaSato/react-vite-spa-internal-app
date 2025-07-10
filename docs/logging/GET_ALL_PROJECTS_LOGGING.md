# Console Logging for Get All Projects - Implementation Summary

## Overview
Comprehensive console logging has been implemented throughout the "Get All Projects" API call flow to help with debugging and monitoring. The logging covers all layers from the UI components down to the HTTP client.

## Logging Layers

### 1. Component Level - ProjectManagement.tsx
**Location:** `src/features/projects/ProjectManagement.tsx`

```typescript
// Log project data changes for debugging
React.useEffect(() => {
  console.log("🔍 [ProjectManagement] Projects data updated:", {
    projectsCount: projects.length,
    loading,
    error,
    firstProject: projects[0] || null,
    projectIds: projects.map(p => p.projectId),
    projectNames: projects.map(p => p.projectName)
  });
}, [projects, loading, error]);

// Log user context for debugging
React.useEffect(() => {
  console.log("👤 [ProjectManagement] User context:", {
    user: user?.email || "No user",
    isAdmin,
    isManager,
    roleName
  });
}, [user, isAdmin, isManager, roleName]);
```

**What it logs:**
- Project count and data when updated
- Loading states and errors
- First project details for quick inspection
- Project IDs and names arrays
- User authentication context and roles

### 2. Hook Level - useProjects.ts
**Location:** `src/shared/hooks/useProjects.ts`

```typescript
// Hook initialization
console.log("⚡ [useProjects] Hook initialized");

// Initial data fetch trigger
console.log("🔄 [useProjects] Initial useEffect triggered - fetching projects and stats");

// Detailed API call tracking
console.log("🚀 [Get All Projects] Starting API call...");
console.log("✅ [Get All Projects] API Response:", {
  success: !!fetchedProjects,
  totalCount: fetchedProjects?.totalCount || 0,
  itemsLength: fetchedProjects?.items?.length || 0,
  pageNumber: fetchedProjects?.pageNumber,
  pageSize: fetchedProjects?.pageSize,
  hasNextPage: fetchedProjects?.hasNextPage,
  fullResponse: fetchedProjects
});
console.log("📊 [Get All Projects] Setting projects:", projects);
console.log("🏁 [Get All Projects] Fetch complete");

// Error handling
console.error("❌ [Get All Projects] Error:", {
  error: err,
  message: errorMessage,
  stack: err instanceof Error ? err.stack : undefined
});
```

**What it logs:**
- Hook initialization and lifecycle events
- API call start/completion markers
- Complete API response analysis
- Pagination and data structure details
- Error details with stack traces
- State updates and data flow

### 3. API Service Level - projectsApi.ts
**Location:** `src/shared/utils/projectsApi.ts`

```typescript
// API call initiation
console.log("🔄 [ProjectsApiService.getAllProjects] Starting API call with params:", params);

// URL construction
console.log("📡 [ProjectsApiService.getAllProjects] Making request to:", url);

// Raw response analysis
console.log("📦 [ProjectsApiService.getAllProjects] Raw API response:", {
  success: response.success,
  data: response.data,
  error: response.error,
  message: response.message
});

// Processed result details
console.log("✅ [ProjectsApiService.getAllProjects] Returning result:", {
  itemsCount: result.items?.length || 0,
  totalCount: result.totalCount,
  pageNumber: result.pageNumber,
  pageSize: result.pageSize,
  hasNextPage: result.hasNextPage,
  firstItem: result.items?.[0] || null
});

// Error handling
console.error("❌ [ProjectsApiService.getAllProjects] Error:", {
  error,
  message: error instanceof Error ? error.message : "Unknown error",
  stack: error instanceof Error ? error.stack : undefined,
  params
});
```

**What it logs:**
- API service method calls with parameters
- Complete URL construction details
- Raw HTTP response analysis
- Data transformation and processing
- Error context with original parameters

### 4. HTTP Client Level - apiClient.ts
**Location:** `src/shared/utils/apiClient.ts`

```typescript
// HTTP request details
console.log("API Request:", {
  url,
  method: config.method || "GET",
  headers: config.headers,
  bodyType: typeof config.body,
  body: config.body,
  hasBody: !!config.body,
});

// HTTP response analysis
console.log("API Response:", {
  status: response.status,
  statusText: response.statusText,
  headers: response.headers ? Object.fromEntries(response.headers.entries()) : {},
});

// Error response body
console.log("API Error Body:", errorBody);
```

**What it logs:**
- Complete HTTP request details
- Response status and headers
- Error response body content
- Network-level debugging information

## Log Message Format

### Icons and Prefixes
- `⚡` - Hook initialization
- `🔄` - Process start/ongoing
- `🚀` - API call initiation
- `📡` - Network request
- `📦` - Raw response data
- `📊` - Data processing
- `✅` - Success states
- `🏁` - Process completion
- `❌` - Error states
- `🔍` - Component data inspection
- `👤` - User context

### Structured Data
All logs include structured data objects for easy filtering and analysis:
- Consistent naming conventions
- Null-safe property access
- Type-safe data extraction
- Context preservation across layers

## Testing the Logging

1. **Start the development server:**
   ```bash
   bun run dev
   ```

2. **Open browser console** (F12 → Console tab)

3. **Navigate to project management pages** to trigger API calls

4. **Filter logs by prefix** to focus on specific layers:
   - `[ProjectManagement]` for component-level
   - `[useProjects]` for hook-level
   - `[ProjectsApiService]` for API service
   - `[Get All Projects]` for specific API call

## Benefits

1. **Full Request Flow Visibility:** Track a request from component mount to API response
2. **Error Debugging:** Detailed error context at each layer
3. **Performance Analysis:** See where time is spent in the request flow
4. **Data Validation:** Verify data transformation at each step
5. **State Management:** Monitor React state updates and their triggers

## Production Considerations

- Consider adding log levels (DEBUG, INFO, WARN, ERROR)
- Implement log filtering based on environment
- Add structured logging for better parsing
- Consider removing or reducing logs in production builds
