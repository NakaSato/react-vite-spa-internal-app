import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationProps) => {
  const theme = useTheme();
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: "Sarabun, sans-serif",
          color: theme.palette.text.secondary,
          fontWeight: 500,
        }}
      >
        Showing {startItem} to {endItem} of {totalCount} projects
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Previous Button */}
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          startIcon={<ChevronLeft />}
          variant="outlined"
          size="small"
          sx={{
            fontFamily: "Sarabun, sans-serif",
            fontWeight: 500,
            minWidth: 100,
            borderRadius: 2,
            px: 2,
            py: 1,
            borderColor: alpha(theme.palette.divider, 0.5),
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
            "&:disabled": {
              borderColor: alpha(theme.palette.divider, 0.3),
              color: theme.palette.text.disabled,
            },
          }}
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <ButtonGroup
          variant="outlined"
          size="small"
          sx={{
            "& .MuiButton-root": {
              minWidth: 40,
              fontFamily: "Sarabun, sans-serif",
              fontWeight: 500,
              borderRadius: 1,
              borderColor: alpha(theme.palette.divider, 0.5),
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            },
          }}
        >
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            const isCurrentPage = page === currentPage;

            return (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                sx={{
                  ...(isCurrentPage && {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                      borderColor: theme.palette.primary.dark,
                    },
                  }),
                }}
              >
                {page}
              </Button>
            );
          })}

          {totalPages > 5 && (
            <>
              <Button disabled sx={{ cursor: "default" }}>
                ...
              </Button>
              <Button
                onClick={() => onPageChange(totalPages)}
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  fontWeight: 500,
                }}
              >
                {totalPages}
              </Button>
            </>
          )}
        </ButtonGroup>

        {/* Next Button */}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          endIcon={<ChevronRight />}
          variant="outlined"
          size="small"
          sx={{
            fontFamily: "Sarabun, sans-serif",
            fontWeight: 500,
            minWidth: 80,
            borderRadius: 2,
            px: 2,
            py: 1,
            borderColor: alpha(theme.palette.divider, 0.5),
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
            "&:disabled": {
              borderColor: alpha(theme.palette.divider, 0.3),
              color: theme.palette.text.disabled,
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Pagination;
