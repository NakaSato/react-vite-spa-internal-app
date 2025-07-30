# React Error Pages & Error Handling Best Practices

## 🚨 Comprehensive Error Handling System

Your React application now includes a complete error handling system with dedicated error pages and utilities.

## 📄 Core Error Pages

### 1. **404 Not Found** (`src/pages/core/NotFound.tsx`)
- **When to use**: Route not found, missing pages
- **Features**: Authentication-aware navigation, helpful links
- **Status Code**: 404

### 2. **500 Server Error** (`src/pages/core/ServerError.tsx`)
- **When to use**: Internal server errors, API failures
- **Features**: Retry functionality, error tracking
- **Status Code**: 500

### 3. **403 Forbidden** (`src/pages/core/Forbidden.tsx`)
- **When to use**: Access denied, insufficient permissions
- **Features**: Role information display, contact support
- **Status Code**: 403

### 4. **Network Error** (`src/pages/core/NetworkError.tsx`)
- **When to use**: Connection issues, offline states
- **Features**: Connection status, troubleshooting tips
- **Status Code**: Network-related

### 5. **Error Fallback** (`src/pages/core/ErrorFallback.tsx`)
- **When to use**: Unexpected application errors, component crashes
- **Features**: Development mode stack traces, error reporting
- **Status Code**: General errors

## 🛡️ Error Boundary System

### Enhanced Error Boundary (`src/components/EnhancedErrorBoundary.tsx`)

```tsx
import EnhancedErrorBoundary from "./components/EnhancedErrorBoundary";

function App() {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        // Custom error handling
        console.error("App Error:", error, errorInfo);
      }}
    >
      <YourAppComponents />
    </EnhancedErrorBoundary>
  );
}
```

**Features:**
- Automatic error type detection
- Error reporting integration ready
- Development mode debugging
- Graceful error recovery

## 🎯 Error Handling Hook

### useErrorHandling (`src/shared/hooks/useErrorHandling.ts`)

```tsx
import { useErrorHandling } from "../shared/hooks/useErrorHandling";

function MyComponent() {
  const {
    error,
    hasError,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling
  } = useErrorHandling({
    redirectOnAuth: true,
    redirectOn404: true
  });

  const fetchData = async () => {
    await executeWithErrorHandling(async () => {
      const response = await apiClient.get("/api/data");
      return response.data;
    }, {
      component: "MyComponent",
      action: "fetchData"
    });
  };

  if (hasError) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <button onClick={fetchData}>
        {isLoading ? "Loading..." : "Fetch Data"}
      </button>
    </div>
  );
}
```

## 🗺️ Route-Level Error Handling

Update your routes to include error pages:

```tsx
// In src/app/AppRoutes.tsx
import { 
  NotFound, 
  ServerError, 
  Forbidden, 
  NetworkError 
} from "../pages/core";

const routes = [
  // ... your existing routes
  
  // Error routes
  { path: "/404", element: <NotFound /> },
  { path: "/500", element: <ServerError /> },
  { path: "/403", element: <Forbidden /> },
  { path: "/network-error", element: <NetworkError /> },
  
  // Catch-all for 404
  { path: "*", element: <NotFound /> }
];
```

## 📊 Error Categorization

The system automatically categorizes errors:

- **🌐 Network**: Connection issues, timeouts
- **🔐 Auth**: Authentication/authorization failures
- **📝 Validation**: Form validation, input errors
- **🔌 API**: Server responses, HTTP errors
- **⚙️ Runtime**: JavaScript errors, component crashes
- **❓ Unknown**: Uncategorized errors

## 🔧 Integration with Existing App

### 1. Update App.tsx

```tsx
import EnhancedErrorBoundary from "./components/EnhancedErrorBoundary";

function App() {
  return (
    <EnhancedErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </EnhancedErrorBoundary>
  );
}
```

### 2. Replace Existing Error Boundary

Your current `App.tsx` has a basic error boundary. Replace it with:

```tsx
// Remove the existing ErrorBoundary class
// Import and use EnhancedErrorBoundary instead
```

### 3. Update ProtectedRoute for 403 Errors

```tsx
import { Forbidden } from "../pages/core";

function ProtectedRoute({ children, requiredRole }) {
  const { user, hasRole } = useAuth();
  
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Forbidden 
        requiredRole={requiredRole}
        currentRole={user?.roleName}
      />
    );
  }
  
  return children;
}
```

## 📈 Error Monitoring Integration

### Ready for Production Monitoring

The error boundary includes hooks for error monitoring services:

```tsx
// In EnhancedErrorBoundary.tsx
private reportError(enhancedError: any, errorInfo: ErrorInfo) {
  // Sentry
  // Sentry.captureException(this.state.error, { extra: errorReport });
  
  // LogRocket
  // LogRocket.captureException(this.state.error);
  
  // DataDog
  // DataDog.logger.error("Error Boundary Error", errorReport);
  
  // Custom API
  // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) });
}
```

## 🎨 Styling & Customization

All error pages use:
- **Tailwind CSS** for consistent styling
- **Responsive design** for mobile compatibility
- **Accessible components** with proper ARIA labels
- **Brand colors** matching your app theme

### Customizing Error Pages

```tsx
// Custom error page with your branding
<ServerError 
  error="Custom error message"
  onRetry={() => {
    // Custom retry logic
  }}
/>
```

## 🧪 Testing Error Pages

### Manual Testing

```bash
# Start development server
bun dev

# Test routes
http://localhost:3000/404           # 404 page
http://localhost:3000/unknown-page  # 404 via catch-all
http://localhost:3000/500           # 500 page
http://localhost:3000/403           # 403 page
http://localhost:3000/network-error # Network error page
```

### Error Simulation

```tsx
// Simulate different error types
function TestErrorComponent() {
  const { handleError } = useErrorHandling();
  
  return (
    <div>
      <button onClick={() => handleError(new Error("Network timeout"))}>
        Test Network Error
      </button>
      <button onClick={() => handleError(new Error("401 Unauthorized"))}>
        Test Auth Error
      </button>
      <button onClick={() => handleError(new Error("500 Server Error"))}>
        Test Server Error
      </button>
    </div>
  );
}
```

## 🔮 Future Enhancements

### Recommended Additions

1. **Analytics Tracking**: Track error occurrences
2. **User Feedback**: Allow users to report issues
3. **Error Recovery**: Smart retry mechanisms
4. **Offline Support**: Service worker integration
5. **A/B Testing**: Test different error page designs

### Performance Considerations

- Error pages are lightweight and fast-loading
- No external dependencies for critical error states
- Graceful degradation for network issues
- Minimal JavaScript for maximum reliability

## 📋 Checklist

- ✅ **404 Page**: Created and styled
- ✅ **500 Page**: Server error handling
- ✅ **403 Page**: Access control errors
- ✅ **Network Error**: Connection issues
- ✅ **Error Fallback**: General error catch-all
- ✅ **Error Boundary**: Enhanced error catching
- ✅ **Error Hook**: Reusable error handling
- ✅ **Route Integration**: Error pages in routing
- ✅ **Documentation**: This comprehensive guide

Your React application now has enterprise-grade error handling! 🎉
