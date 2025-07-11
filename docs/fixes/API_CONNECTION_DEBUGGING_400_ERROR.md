# API Connection Debugging Guide

## 🚨 Issue: 400 Bad Request on Project Detail Fetch

### Problem Description
When clicking on project cards to view project details, the application shows a 400 Bad Request error:
```
GET http://localhost:5001/api/v1/projects/c139be92-54f6-45fa-ac99-d4aa51620d13 400 (Bad Request)
```

### Root Cause Analysis

#### 1. **Port Configuration Issue**
- **Expected**: API should run on `localhost:5002` (Docker configuration)
- **Current**: Request going to `localhost:5001` 
- **Solution**: Updated `.env` file to use correct port

#### 2. **Environment Variable Caching**
- Environment variables may be cached by the dev server
- **Solution**: Restart dev server after changing `.env`

#### 3. **API Server Status**
- The API server might not be running
- The project ID might not exist in the database
- **Solution**: Test API connectivity and data

### 🔧 Debugging Steps

#### Step 1: Verify Environment Configuration
```bash
# Check current .env file
cat .env

# Should show:
VITE_API_BASE_URL=http://localhost:5002
VITE_ENV=development
```

#### Step 2: Restart Development Server
```bash
# Kill existing dev server
kill $(lsof -t -i:3000) 2>/dev/null || true

# Start fresh
bun dev
```

#### Step 3: Use API Debug Tool
1. Navigate to `http://localhost:3000/api-debug`
2. Click "Test API Connection" to verify basic connectivity
3. Click "Test Specific Project ID" to test the failing ID
4. Review console logs for detailed error information

#### Step 4: Check API Server
```bash
# Verify API server is running on correct port
curl http://localhost:5002/api/v1/projects

# Should return project list or proper error response
```

### 🔍 Enhanced Debugging Features

#### Console Logging
The application now includes comprehensive logging:

```typescript
// API Client logs
🔗 API Configuration: { API_BASE_URL: "http://localhost:5002" }
🔍 [ProjectsAPI] Fetching project by ID: {projectId}
🔗 [ProjectsAPI] Full URL will be: /api/v1/projects/{projectId}
📦 [ProjectsAPI] API Response: { success: true, hasData: true }

// Error logs
❌ [ProjectsAPI] Failed to fetch project {projectId}: {errorDetails}
🔧 [ProjectsAPI] Debug info: { projectId, endpoint, fullUrl, errorType }
```

#### Error Message Enhancement
- **400 Bad Request**: Shows user-friendly message about invalid project ID
- **Network Error**: Indicates API server connection issues
- **Generic Error**: Provides debugging information for developers

### 🎯 Potential Solutions

#### Solution 1: API Server Not Running
```bash
# Start the API server (Docker)
docker-compose up -d

# Or start manually if using local .NET server
dotnet run --project YourApiProject
```

#### Solution 2: Database Empty
- The project ID might not exist in the database
- Test with a valid project ID from the project list
- Use the API debug tool to find valid project IDs

#### Solution 3: API Endpoint Issues
- Check if the API endpoint structure matches expectations
- Verify the API is returning the expected response format
- Test with Postman or curl

#### Solution 4: CORS Issues
- Ensure API server allows requests from `localhost:3000`
- Check API server CORS configuration

### 📋 Testing Checklist

- [ ] `.env` file has correct port (5002)
- [ ] Development server restarted after env changes
- [ ] API server is running on port 5002
- [ ] API debug tool shows successful connection
- [ ] Console shows correct API base URL
- [ ] Project list endpoint works (`/api/v1/projects`)
- [ ] At least one project exists in database

### 🚀 Next Steps

1. **Immediate**: Use the API debug tool to identify the exact issue
2. **Verify**: Check if API server is running and accessible
3. **Test**: Try with different project IDs to isolate the issue
4. **Fix**: Apply the appropriate solution based on debug results

---

*Debug guide created: July 11, 2025*  
*Tools available: API Debug Test page at `/api-debug`*
