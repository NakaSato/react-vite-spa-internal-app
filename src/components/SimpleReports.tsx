import {
  alpha,
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";

interface DateRange {
  start: string;
  end: string;
}

interface SimpleReportsProps {
  onGenerateReport: (reportType: string, dateRange: DateRange) => void;
}

const SimpleReports: React.FC<SimpleReportsProps> = ({ onGenerateReport }) => {
  const theme = useTheme();
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: "daily", label: "Daily Report" },
    { value: "weekly", label: "Weekly Summary" },
    { value: "monthly", label: "Monthly Report" },
    { value: "project", label: "Project Status" },
    { value: "financial", label: "Financial Summary" },
  ];

  const handleGenerateReport = async () => {
    if (!reportType || !startDate || !endDate) {
      return;
    }

    setIsGenerating(true);

    const dateRange: DateRange = {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    };

    try {
      await onGenerateReport(reportType, dateRange);
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = reportType && startDate && endDate;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card
        sx={{
          p: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontFamily: "Sarabun, sans-serif",
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Generate Simple Reports
        </Typography>

        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
            >
              {reportTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleGenerateReport}
              disabled={!isFormValid || isGenerating}
              sx={{
                px: 4,
                py: 1.5,
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
                "&:disabled": {
                  bgcolor: alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </Box>
        </Stack>
      </Card>
    </LocalizationProvider>
  );
};

export default SimpleReports;
