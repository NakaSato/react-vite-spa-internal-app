import {
  Add,
  Delete,
  Download,
  Edit,
  Refresh,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import React from "react";

interface TableAction {
  icon: React.ReactElement;
  label: string;
  onClick: (id: GridRowId) => void;
  color?: "inherit" | "primary" | "default";
  show?: (row: any) => boolean;
}

interface DataTableTemplateProps {
  title: string;
  subtitle?: string;
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  onAdd?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  actions?: TableAction[];
  height?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  className?: string;
  toolbar?: React.ReactNode;
  showToolbar?: boolean;
  density?: "compact" | "standard" | "comfortable";
}

/**
 * DataTableTemplate Component
 *
 * Provides a consistent data table interface using MUI DataGrid
 * Features:
 * - Advanced filtering and sorting
 * - Row actions with customizable buttons
 * - Export functionality
 * - Responsive design
 * - Loading states
 * - Pagination
 * - Thai/English support with Sarabun font
 */
export const DataTableTemplate: React.FC<DataTableTemplateProps> = ({
  title,
  subtitle,
  rows,
  columns,
  loading = false,
  onAdd,
  onRefresh,
  onExport,
  actions = [],
  height = 400,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  checkboxSelection = false,
  disableSelectionOnClick = true,
  className = "",
  toolbar,
  showToolbar = true,
  density = "standard",
}) => {
  // Add actions column if actions are provided
  const enhancedColumns: GridColDef[] = React.useMemo(() => {
    if (actions.length === 0) return columns;

    const actionsColumn: GridColDef = {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        return actions
          .filter((action) => !action.show || action.show(row))
          .map((action, index) => (
            <GridActionsCellItem
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={() => action.onClick(id)}
              color={action.color || "primary"}
            />
          ));
      },
    };

    return [...columns, actionsColumn];
  }, [columns, actions]);

  return (
    <Card className={`w-full ${className}`} elevation={2}>
      {/* Header */}
      <CardContent className="pb-2">
        <Box className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Box>
            <Typography
              variant="h5"
              component="h2"
              className="font-sarabun-semibold mb-1 text-gray-800"
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                className="font-sarabun-regular text-gray-600"
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} className="mt-3 sm:mt-0">
            {onRefresh && (
              <IconButton
                onClick={onRefresh}
                size="small"
                className="hover:text-primary text-gray-600"
                title="Refresh data"
              >
                <Refresh />
              </IconButton>
            )}
            {onExport && (
              <Button
                startIcon={<Download />}
                variant="outlined"
                size="small"
                onClick={onExport}
                className="font-sarabun-medium"
              >
                Export
              </Button>
            )}
            {onAdd && (
              <Button
                startIcon={<Add />}
                variant="contained"
                size="small"
                onClick={onAdd}
                className="font-sarabun-medium"
              >
                Add New
              </Button>
            )}
          </Stack>
        </Box>

        {/* Custom Toolbar */}
        {toolbar && <Box className="mb-4">{toolbar}</Box>}
      </CardContent>

      {/* Data Grid */}
      <Box className="px-6 pb-6">
        <DataGrid
          rows={rows}
          columns={enhancedColumns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize },
            },
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableSelectionOnClick}
          density={density}
          slots={{
            toolbar: showToolbar ? GridToolbar : null,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            height,
            border: "none",
            "& .MuiDataGrid-cell": {
              fontFamily: "Sarabun, sans-serif",
            },
            "& .MuiDataGrid-columnHeader": {
              fontFamily: "Sarabun, sans-serif",
              fontWeight: 600,
              backgroundColor: alpha("#1976d2", 0.05),
            },
            "& .MuiDataGrid-toolbarContainer": {
              padding: "8px 16px",
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "divider",
            },
          }}
          className="font-sarabun-regular"
        />
      </Box>
    </Card>
  );
};

// Common action configurations for reuse
export const commonTableActions = {
  view: (onClick: (id: GridRowId) => void): TableAction => ({
    icon: <Visibility />,
    label: "View",
    onClick,
    color: "primary" as const,
  }),
  edit: (onClick: (id: GridRowId) => void): TableAction => ({
    icon: <Edit />,
    label: "Edit",
    onClick,
    color: "default" as const,
  }),
  delete: (onClick: (id: GridRowId) => void): TableAction => ({
    icon: <Delete />,
    label: "Delete",
    onClick,
    color: "default" as const,
  }),
};

export default DataTableTemplate;
