# MUI Template Implementation Guide

## 🚀 Quick Start Implementation

This guide provides practical steps and code examples for implementing the MUI template library migration.

---

## 📁 Recommended Project Structure

```
src/
├── templates/
│   ├── layouts/
│   │   ├── DashboardLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── FullscreenLayout.tsx
│   │   └── index.ts
│   ├── pages/
│   │   ├── ListPageTemplate.tsx
│   │   ├── DetailPageTemplate.tsx
│   │   ├── FormPageTemplate.tsx
│   │   └── index.ts
│   ├── components/
│   │   ├── DataTableTemplate.tsx
│   │   ├── FormTemplate.tsx
│   │   ├── ChartTemplate.tsx
│   │   └── index.ts
│   └── index.ts
├── theme/
│   ├── components.ts      // Component overrides
│   ├── typography.ts      // Typography system
│   ├── colors.ts         // Color palette
│   └── index.ts
└── [existing structure]
```

---

## 🏗️ Step 1: Create Layout Templates

### DashboardLayout Template

```tsx
// src/templates/layouts/DashboardLayout.tsx
import React, { useState, ReactNode } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  Assessment,
  Settings,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '@shared/hooks';
import { NavbarApiStatus } from '@widgets';

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  breadcrumbs = [],
  actions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Projects', icon: <Assignment />, path: '/projects' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Solar ICMS
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component="a" href={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <NavbarApiStatus compact />
          
          <IconButton
            size="large"
            edge="end"
            aria-label="account menu"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar src={user?.avatar} alt={user?.name}>
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs sx={{ mb: 2 }}>
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                href={crumb.href}
                underline="hover"
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}

        {/* Page Actions */}
        {actions && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            {actions}
          </Box>
        )}

        {children}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); logout(); }}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;
```

---

## 📄 Step 2: Create Page Templates

### ListPageTemplate

```tsx
// src/templates/pages/ListPageTemplate.tsx
import React, { ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Toolbar,
  alpha,
} from '@mui/material';
import { Search, Add, FilterList } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

interface ListPageTemplateProps {
  title: string;
  data: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAdd?: () => void;
  onFilter?: () => void;
  actions?: ReactNode;
  emptyStateMessage?: string;
}

export const ListPageTemplate: React.FC<ListPageTemplateProps> = ({
  title,
  data,
  columns,
  loading = false,
  searchValue = '',
  onSearchChange,
  onAdd,
  onFilter,
  actions,
  emptyStateMessage = 'No data available',
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: (theme) =>
            alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h4"
            component="div"
          >
            {title}
          </Typography>
          
          {/* Search */}
          {onSearchChange && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 1, minWidth: 250 }}
            />
          )}

          {/* Filter Button */}
          {onFilter && (
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={onFilter}
              sx={{ mr: 1 }}
            >
              Filter
            </Button>
          )}

          {/* Add Button */}
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAdd}
            >
              Add New
            </Button>
          )}

          {/* Custom Actions */}
          {actions}
        </Toolbar>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  {emptyStateMessage}
                </Typography>
              </Box>
            ),
          }}
        />
      </Paper>
    </Box>
  );
};

export default ListPageTemplate;
```

---

## 📊 Step 3: Create Component Templates

### FormTemplate

```tsx
// src/templates/components/FormTemplate.tsx
import React, { ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Save, Cancel, NavigateNext, NavigateBefore } from '@mui/icons-material';

interface FormStep {
  label: string;
  content: ReactNode;
  optional?: boolean;
}

interface FormTemplateProps {
  title: string;
  steps?: FormStep[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  success?: string;
  children?: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const FormTemplate: React.FC<FormTemplateProps> = ({
  title,
  steps,
  currentStep = 0,
  onStepChange,
  onSubmit,
  onCancel,
  loading = false,
  error,
  success,
  children,
  actions,
  maxWidth = 'md',
}) => {
  const isMultiStep = steps && steps.length > 1;
  const isFirstStep = currentStep === 0;
  const isLastStep = steps ? currentStep === steps.length - 1 : true;

  const handleNext = () => {
    if (onStepChange && steps && currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (onStepChange && currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: (theme) => theme.breakpoints.values[maxWidth],
        mx: 'auto',
        p: 2,
      }}
    >
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>

        {/* Multi-step Progress */}
        {isMultiStep && steps && (
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel optional={step.optional ? 'Optional' : undefined}>
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Form Content */}
        <Box sx={{ mb: 3, minHeight: 200 }}>
          {steps ? steps[currentStep]?.content : children}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left side - Back button for multi-step */}
          <Box>
            {isMultiStep && !isFirstStep && (
              <Button
                onClick={handleBack}
                startIcon={<NavigateBefore />}
                disabled={loading}
              >
                Back
              </Button>
            )}
          </Box>

          {/* Right side - Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Custom actions */}
            {actions}

            {/* Cancel button */}
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                startIcon={<Cancel />}
                disabled={loading}
              >
                Cancel
              </Button>
            )}

            {/* Next/Submit button */}
            {isMultiStep && !isLastStep ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NavigateNext />}
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              onSubmit && (
                <Button
                  variant="contained"
                  onClick={onSubmit}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Save />
                    )
                  }
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              )
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormTemplate;
```

---

## 🎨 Step 4: Enhanced Theme Configuration

```typescript
// src/shared/theme/components.ts
import { Components, Theme } from '@mui/material/styles';

export const componentOverrides: Components<Omit<Theme, 'components'>> = {
  // Button overrides
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        fontWeight: 600,
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
    },
  },

  // Card overrides
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        '&:hover': {
          boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        },
      },
    },
  },

  // Paper overrides
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },

  // AppBar overrides
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      },
    },
  },

  // DataGrid overrides
  MuiDataGrid: {
    styleOverrides: {
      root: {
        border: 'none',
      },
      cell: {
        borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
      },
    },
  },
};
```

```typescript
// src/shared/theme/colors.ts
export const solarColors = {
  primary: {
    main: '#1976d2',      // Solar blue
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#388e3c',      // Solar green
    light: '#66bb6a',
    dark: '#2e7d32',
  },
  warning: {
    main: '#ffa726',      // Solar orange
    light: '#ffb74d',
    dark: '#f57c00',
  },
  success: {
    main: '#4caf50',      // Success green
  },
  error: {
    main: '#f44336',      // Error red
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};
```

---

## 🔄 Step 5: Migration Example

### Converting Existing Component

```tsx
// BEFORE: src/pages/core/Dashboard.tsx (existing)
export default function Dashboard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            {project.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// AFTER: Using DashboardLayout + Templates
import { DashboardLayout } from '@templates/layouts';
import { ProjectCardTemplate } from '@templates/components';

export default function Dashboard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  
  return (
    <DashboardLayout
      title="Dashboard"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard' }
      ]}
    >
      <Grid container spacing={3}>
        {projects.map(project => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCardTemplate project={project} />
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
}
```

---

## 📋 Implementation Checklist

### Phase 1: Setup ✅
- [x] MUI dependencies installed
- [x] Theme system configured
- [ ] Template directory structure created
- [ ] Component overrides implemented

### Phase 2: Layout Templates
- [ ] DashboardLayout created and tested
- [ ] AuthLayout created and tested
- [ ] Error layouts created

### Phase 3: Page Templates
- [ ] ListPageTemplate implemented
- [ ] DetailPageTemplate implemented
- [ ] FormTemplate implemented

### Phase 4: Component Templates
- [ ] DataTableTemplate created
- [ ] ChartTemplate created
- [ ] CardTemplate created

### Phase 5: Migration
- [ ] Convert Dashboard page
- [ ] Convert Project pages
- [ ] Convert Report pages
- [ ] Update navigation components

---

## 🛠️ Development Commands

```bash
# Start development server with templates
bun run dev

# Build with template optimization
bun run build

# Test template components
bun run test

# Generate new template
bun run generate:template [type] [name]
```

This implementation guide provides the foundation for a systematic migration to MUI templates while maintaining your existing functionality and improving the overall design consistency.
