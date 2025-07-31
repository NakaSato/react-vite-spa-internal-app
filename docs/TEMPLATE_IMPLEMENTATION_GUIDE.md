# MUI Template Library Implementation Guide

## 🎯 Current Status & Next Steps

### ✅ Foundation Complete
Your project now has a **world-class foundation** for template library development:
- **MUI 7.2.0** ecosystem fully integrated
- **Tailwind CSS 3.4.17** for rapid styling
- **Prettier 3.6.2** with automatic formatting
- **TypeScript 5.8.3** with strict typing
- **Vite 7.0.6** for optimized builds

## 🚀 Week 1 Implementation Tasks

### Task 1: Create AuthLayout Template
**Goal**: Extract authentication layout pattern from existing auth pages

```bash
# Create the auth layout template
touch src/templates/layouts/AuthLayout.tsx
```

**Implementation Pattern**:
```typescript
// src/templates/layouts/AuthLayout.tsx
import React, { ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  backgroundImage = '/images/solar-background.jpg'
}) => {
  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <Container maxWidth="sm" className="py-8">
        <Paper 
          elevation={8}
          className="p-8 rounded-2xl bg-white/95 backdrop-blur-sm"
          sx={{
            '&:hover': {
              transform: 'translateY(-4px)',
              transition: 'transform 0.3s ease-in-out'
            }
          }}
        >
          <Box className="text-center mb-6">
            <Typography 
              variant="h4" 
              className="font-bold text-gray-800 mb-2"
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body1" 
                className="text-gray-600"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
```

### Task 2: Create ErrorLayout Template
**Goal**: Standardize error page presentations

```bash
# Create the error layout template
touch src/templates/layouts/ErrorLayout.tsx
```

**Implementation Pattern**:
```typescript
// src/templates/layouts/ErrorLayout.tsx
import React, { ReactNode } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ErrorLayoutProps {
  children?: ReactNode;
  errorCode: number;
  title: string;
  message: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  actions?: ReactNode;
}

export const ErrorLayout: React.FC<ErrorLayoutProps> = ({
  children,
  errorCode,
  title,
  message,
  showHomeButton = true,
  showBackButton = true,
  actions
}) => {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50">
      <Container maxWidth="md" className="text-center">
        <Paper 
          elevation={4}
          className="p-12 rounded-3xl bg-white"
        >
          <Typography 
            variant="h1" 
            className="text-8xl font-bold text-blue-500 mb-4"
          >
            {errorCode}
          </Typography>
          
          <Typography 
            variant="h4" 
            className="font-semibold text-gray-800 mb-4"
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body1" 
            className="text-gray-600 mb-8 max-w-md mx-auto"
          >
            {message}
          </Typography>

          {children}

          <Box className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {showBackButton && (
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                className="px-6 py-2"
              >
                Go Back
              </Button>
            )}
            
            {showHomeButton && (
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                className="px-6 py-2"
              >
                Go Home
              </Button>
            )}
            
            {actions}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ErrorLayout;
```

### Task 3: Create DataTableTemplate
**Goal**: Standardize data display with MUI X DataGrid

```bash
# Create the data table template
touch src/templates/components/DataTableTemplate.tsx
```

**Implementation Pattern**:
```typescript
// src/templates/components/DataTableTemplate.tsx
import React, { useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
  GridFilterModel,
  GridSortModel
} from '@mui/x-data-grid';
import { Box, Paper, Typography, Chip } from '@mui/material';

interface DataTableTemplateProps {
  title?: string;
  columns: GridColDef[];
  rows: GridRowsProp;
  loading?: boolean;
  pageSize?: number;
  enableExport?: boolean;
  enableFiltering?: boolean;
  height?: number;
  onRowClick?: (params: any) => void;
  toolbar?: React.ReactNode;
}

export const DataTableTemplate: React.FC<DataTableTemplateProps> = ({
  title,
  columns,
  rows,
  loading = false,
  pageSize = 25,
  enableExport = true,
  enableFiltering = true,
  height = 600,
  onRowClick,
  toolbar
}) => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  return (
    <Paper 
      elevation={2}
      className="p-6 rounded-xl bg-white"
    >
      {title && (
        <Box className="mb-4 flex items-center justify-between">
          <Typography variant="h6" className="font-semibold text-gray-800">
            {title}
          </Typography>
          <Chip 
            label={`${rows.length} records`}
            color="primary"
            variant="outlined"
            className="text-sm"
          />
        </Box>
      )}

      {toolbar && (
        <Box className="mb-4">
          {toolbar}
        </Box>
      )}

      <Box 
        className="w-full"
        sx={{ height }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize } },
          }}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onRowClick={onRowClick}
          slots={{
            toolbar: enableExport || enableFiltering ? GridToolbar : undefined,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: enableFiltering,
              printOptions: { disableToolbarButton: !enableExport },
              csvOptions: { disableToolbarButton: !enableExport },
            },
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              borderColor: 'rgba(224, 224, 224, 0.5)',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              borderColor: 'rgba(224, 224, 224, 0.5)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default DataTableTemplate;
```

## 📝 Implementation Checklist

### Week 1 Tasks
- [ ] Create `AuthLayout.tsx` template
- [ ] Create `ErrorLayout.tsx` template  
- [ ] Create `DataTableTemplate.tsx` template
- [ ] Update existing auth pages to use `AuthLayout`
- [ ] Update error pages to use `ErrorLayout`
- [ ] Replace at least one table with `DataTableTemplate`

### Week 2 Tasks
- [ ] Create `DetailPageTemplate.tsx`
- [ ] Create `FormTemplate.tsx` enhancements
- [ ] Create `ChartTemplate.tsx` based on existing charts
- [ ] Integrate templates into 2-3 existing pages

### Template Integration Example

```typescript
// Example: Update src/pages/auth/Login.tsx
import { AuthLayout } from '@templates/layouts';
import { LoginFormMUI } from '@features/auth';

export default function Login() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your solar project dashboard"
    >
      <LoginFormMUI />
    </AuthLayout>
  );
}
```

## 🎯 Success Metrics

Track these metrics weekly:
- **Templates Created**: Target 3-4 templates per week
- **Pages Migrated**: Target 2-3 pages per week  
- **Component Reuse**: Measure template usage across pages
- **Development Speed**: Time to create new pages with templates
- **Design Consistency**: Visual consistency across migrated pages

## 🔧 Development Tips

1. **Start Small**: Begin with simple templates, add complexity gradually
2. **Test Early**: Use existing pages to validate template patterns
3. **Document**: Update docs as you create each template
4. **Reuse**: Look for patterns across existing components
5. **Iterate**: Refine templates based on usage feedback

Your foundation is excellent - now it's time to build the template library! 🚀
