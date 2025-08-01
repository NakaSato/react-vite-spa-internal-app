import { Refresh, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  alpha,
  useTheme,
} from "@mui/material";

interface ProjectFiltersProps {
  searchTerm: string;
  statusFilter: string;
  sortBy: string;
  pageSize: number;
  onSearch: (term: string) => void;
  onStatusFilter: (status: string) => void;
  onSortChange: (sort: string) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
}

export const ProjectFilters = ({
  searchTerm,
  statusFilter,
  sortBy,
  pageSize,
  onSearch,
  onStatusFilter,
  onSortChange,
  onPageSizeChange,
  onRefresh,
}: ProjectFiltersProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
        px: 4,
        py: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          maxWidth: "100%",
        }}
      >
        {/* Search Input */}
        <Box sx={{ minWidth: 280, flex: 1, maxWidth: 400 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              sx: {
                fontFamily: "Sarabun, sans-serif",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                },
              },
            }}
          />
        </Box>

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel sx={{ fontFamily: "Sarabun, sans-serif" }}>
            Status
          </InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => onStatusFilter(e.target.value)}
            sx={{
              fontFamily: "Sarabun, sans-serif",
              borderRadius: 2,
              "& .MuiSelect-select": {
                fontFamily: "Sarabun, sans-serif",
              },
            }}
          >
            <MenuItem value="all" sx={{ fontFamily: "Sarabun, sans-serif" }}>
              All Status
            </MenuItem>
            <MenuItem
              value="Planning"
              sx={{ fontFamily: "Sarabun, sans-serif" }}
            >
              Planning
            </MenuItem>
            <MenuItem
              value="InProgress"
              sx={{ fontFamily: "Sarabun, sans-serif" }}
            >
              In Progress
            </MenuItem>
            <MenuItem
              value="Completed"
              sx={{ fontFamily: "Sarabun, sans-serif" }}
            >
              Completed
            </MenuItem>
            <MenuItem value="OnHold" sx={{ fontFamily: "Sarabun, sans-serif" }}>
              On Hold
            </MenuItem>
            <MenuItem
              value="Cancelled"
              sx={{ fontFamily: "Sarabun, sans-serif" }}
            >
              Cancelled
            </MenuItem>
          </Select>
        </FormControl>

        {/* Sort Options */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontFamily: "Sarabun, sans-serif" }}>
            Sort By
          </InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => onSortChange(e.target.value)}
            sx={{
              fontFamily: "Sarabun, sans-serif",
              borderRadius: 2,
              "& .MuiSelect-select": {
                fontFamily: "Sarabun, sans-serif",
              },
            }}
          >
            <MenuItem value="name" sx={{ fontFamily: "Sarabun, sans-serif" }}>
              Sort by Name
            </MenuItem>
            <MenuItem value="status" sx={{ fontFamily: "Sarabun, sans-serif" }}>
              Sort by Status
            </MenuItem>
            <MenuItem
              value="startDate"
              sx={{ fontFamily: "Sarabun, sans-serif" }}
            >
              Sort by Start Date
            </MenuItem>
            <MenuItem
              value="capacity"
              sx={{ fontFamily: "Sarabun, sans-serif" }}
            >
              Sort by Capacity
            </MenuItem>
          </Select>
        </FormControl>

        {/* Page Size Selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ fontFamily: "Sarabun, sans-serif" }}>
            Per Page
          </InputLabel>
          <Select
            value={pageSize}
            label="Per Page"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            sx={{
              fontFamily: "Sarabun, sans-serif",
              borderRadius: 2,
              "& .MuiSelect-select": {
                fontFamily: "Sarabun, sans-serif",
              },
            }}
          >
            <MenuItem value={6} sx={{ fontFamily: "Sarabun, sans-serif" }}>
              6 per page
            </MenuItem>
            <MenuItem value={12} sx={{ fontFamily: "Sarabun, sans-serif" }}>
              12 per page
            </MenuItem>
            <MenuItem value={24} sx={{ fontFamily: "Sarabun, sans-serif" }}>
              24 per page
            </MenuItem>
          </Select>
        </FormControl>

        {/* Refresh Button */}
        <Button
          variant="outlined"
          size="small"
          onClick={onRefresh}
          startIcon={<Refresh />}
          sx={{
            fontFamily: "Sarabun, sans-serif",
            fontWeight: 500,
            borderRadius: 2,
            px: 2,
            py: 1,
            minWidth: 100,
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              transform: "scale(1.02)",
            },
          }}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectFilters;
