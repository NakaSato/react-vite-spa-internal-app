# TypeScript Unused Variables Guide

## Quick Fixes for Common Unused Variable Errors

### 1. Unused React Import (Modern JSX Transform)
```tsx
// ❌ Error: 'React' is declared but its value is never read
import React from "react";

// ✅ Fix: Remove React import (modern JSX transform handles it)
// import React from "react"; // Remove this line
```

### 2. Unused Destructured Variables
```tsx
// ❌ Error: 'user' is declared but its value is never read
const { isAuthenticated, user } = useAuth();

// ✅ Fix: Prefix with underscore to indicate intentionally unused
const { isAuthenticated, user: _user } = useAuth();

// ✅ Or just destructure what you need
const { isAuthenticated } = useAuth();
```

### 3. Unused Function Parameters
```tsx
// ❌ Error: 'event' is declared but its value is never read
onChange={(event) => {
  doSomething();
}}

// ✅ Fix: Prefix with underscore
onChange={(_event) => {
  doSomething();
}}

// ✅ Or omit parameter name if truly unused
onChange={() => {
  doSomething();
}}
```

### 4. Unused Imports
```tsx
// ❌ Error: 'Navigate' is declared but its value is never read
import { Routes, Route, Navigate } from "react-router-dom";

// ✅ Fix: Remove unused import
import { Routes, Route } from "react-router-dom";
```

### 5. Unused Loop Indices
```tsx
// ❌ Error: 'index' is declared but its value is never read
items.map((item, index) => (
  <div key={item.id}>{item.name}</div>
))

// ✅ Fix: Prefix with underscore
items.map((item, _index) => (
  <div key={item.id}>{item.name}</div>
))
```

## Batch Fixing

### Use the provided script:
```bash
chmod +x scripts/fix-unused-vars.sh
./scripts/fix-unused-vars.sh
```

### Manual ESLint fixes (if available):
```bash
bun run lint --fix
```

## Configuration Options

### TypeScript Config (tsconfig.json)
```json
{
  "compilerOptions": {
    "noUnusedLocals": false,      // Disable unused locals checking
    "noUnusedParameters": false   // Disable unused parameters checking
  }
}
```

### ESLint Config (eslint.config.js)
```javascript
{
  "@typescript-eslint/no-unused-vars": [
    "warn", // Use warning instead of error
    {
      "argsIgnorePattern": "^_",           // Ignore args starting with _
      "varsIgnorePattern": "^_",           // Ignore vars starting with _
      "destructuredArrayIgnorePattern": "^_" // Ignore destructured arrays starting with _
    }
  ]
}
```

## Best Practices

1. **Use underscore prefix** for intentionally unused variables
2. **Remove truly unused imports** and variables
3. **Keep unused parameters** if they're part of a required interface
4. **Use ESLint ignore comments** sparingly for complex cases:
   ```tsx
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const unusedVar = someComplexLogic();
   ```

## Development vs Production

- **Development**: Use warnings instead of errors for faster iteration
- **Production**: Consider enabling stricter checks in CI/CD pipeline
- **Team**: Establish conventions for handling unused variables consistently
