import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Slider,
  MenuItem,
  LinearProgress,
  Grid,
  Stack,
  Chip,
  IconButton,
  Card,
  CardContent,
  Fade,
  Zoom,
  CircularProgress,
} from "@mui/material";
import {
  WbSunny,
  Cloud,
  Grain,
  NavigateNext,
  NavigateBefore,
  Send,
  Cancel,
  Assignment,
  ThermostatAuto,
  Group,
  Build,
  Assessment,
  Notes,
} from "@mui/icons-material";
import { CreateDailyReportRequest } from "../shared/types/reports";

interface QuickReportFormProps {
  projectId: string;
  onSubmit: (data: CreateDailyReportRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const steps = [
  "Basic Information",
  "Weather & Conditions",
  "Work Summary",
  "Scores & Final Notes",
];

const weatherOptions = [
  { value: "Sunny", label: "☀️ Sunny", icon: <WbSunny /> },
  { value: "PartlyCloudy", label: "⛅ Partly Cloudy", icon: <Cloud /> },
  { value: "Cloudy", label: "☁️ Cloudy", icon: <Cloud /> },
  { value: "Rainy", label: "🌧️ Rainy", icon: <Grain /> },
  { value: "Stormy", label: "⛈️ Stormy", icon: <Grain /> },
  { value: "Foggy", label: "🌫️ Foggy", icon: <Cloud /> },
  { value: "Snow", label: "❄️ Snow", icon: <Grain /> },
  { value: "Windy", label: "💨 Windy", icon: <WbSunny /> },
];

export default function QuickReportForm({
  projectId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: QuickReportFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<CreateDailyReportRequest>({
    projectId,
    reportDate: today,
    totalWorkHours: 8,
    personnelOnSite: 5,
    weatherCondition: "Sunny",
    temperature: 75,
    humidity: 50,
    workSummary: "",
    workAccomplished: "",
    workPlannedNextDay: "",
    issuesEncountered: "",
    safetyScore: 8,
    qualityScore: 8,
    dailyProgressContribution: 10,
    additionalNotes: "",
  });

  const handleInputChange = (
    field: keyof CreateDailyReportRequest,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const getStepIcon = (step: number) => {
    const icons = [
      <Assignment key="assignment" />,
      <ThermostatAuto key="weather" />,
      <Build key="work" />,
      <Assessment key="assessment" />,
    ];
    return icons[step];
  };

  const renderStep1 = () => (
    <Fade in timeout={500}>
      <Box>
        <Stack spacing={3}>
          <Box textAlign="center" mb={2}>
            <Assignment sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
            <Typography variant="h5" color="primary.main" fontWeight="bold">
              Basic Information
            </Typography>
          </Box>

          <TextField
            type="date"
            label="Report Date"
            value={formData.reportDate}
            onChange={(e) => handleInputChange("reportDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Work Hours"
                value={formData.totalWorkHours}
                onChange={(e) =>
                  handleInputChange("totalWorkHours", Number(e.target.value))
                }
                inputProps={{ min: 0, max: 24, step: 0.5 }}
                InputProps={{
                  startAdornment: (
                    <Group sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Personnel on Site"
                value={formData.personnelOnSite}
                onChange={(e) =>
                  handleInputChange("personnelOnSite", Number(e.target.value))
                }
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: (
                    <Group sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Fade>
  );

  const renderStep2 = () => (
    <Fade in timeout={500}>
      <Box>
        <Stack spacing={3}>
          <Box textAlign="center" mb={2}>
            <ThermostatAuto
              sx={{ fontSize: 48, color: "warning.main", mb: 1 }}
            />
            <Typography variant="h5" color="warning.main" fontWeight="bold">
              Weather & Conditions
            </Typography>
          </Box>

          <TextField
            select
            label="Weather Condition"
            value={formData.weatherCondition || "Sunny"}
            onChange={(e) =>
              handleInputChange("weatherCondition", e.target.value)
            }
            fullWidth
          >
            {weatherOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  {option.icon}
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Temperature (°F)"
                value={formData.temperature || ""}
                onChange={(e) =>
                  handleInputChange("temperature", Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Humidity (%)"
                value={formData.humidity || ""}
                onChange={(e) =>
                  handleInputChange("humidity", Number(e.target.value))
                }
                inputProps={{ min: 0, max: 100 }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Fade>
  );

  const renderStep3 = () => (
    <Fade in timeout={500}>
      <Box>
        <Stack spacing={3}>
          <Box textAlign="center" mb={2}>
            <Build sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
            <Typography variant="h5" color="success.main" fontWeight="bold">
              Work Summary
            </Typography>
          </Box>

          <TextField
            label="Work Summary"
            multiline
            rows={4}
            value={formData.workSummary}
            onChange={(e) => handleInputChange("workSummary", e.target.value)}
            placeholder="Brief overview of today's work..."
            fullWidth
          />

          <TextField
            label="Work Accomplished"
            multiline
            rows={3}
            value={formData.workAccomplished || ""}
            onChange={(e) =>
              handleInputChange("workAccomplished", e.target.value)
            }
            placeholder="What was completed today..."
            fullWidth
          />

          <TextField
            label="Work Planned for Tomorrow"
            multiline
            rows={3}
            value={formData.workPlannedNextDay || ""}
            onChange={(e) =>
              handleInputChange("workPlannedNextDay", e.target.value)
            }
            placeholder="What's planned for tomorrow..."
            fullWidth
          />

          <TextField
            label="Issues Encountered"
            multiline
            rows={3}
            value={formData.issuesEncountered || ""}
            onChange={(e) =>
              handleInputChange("issuesEncountered", e.target.value)
            }
            placeholder="Any issues or challenges faced today..."
            fullWidth
          />
        </Stack>
      </Box>
    </Fade>
  );

  const renderStep4 = () => (
    <Fade in timeout={500}>
      <Box>
        <Stack spacing={4}>
          <Box textAlign="center" mb={2}>
            <Assessment sx={{ fontSize: 48, color: "info.main", mb: 1 }} />
            <Typography variant="h5" color="info.main" fontWeight="bold">
              Scores & Final Notes
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Safety Score (1-10)
                  </Typography>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={formData.safetyScore}
                      onChange={(_, value) =>
                        handleInputChange("safetyScore", value)
                      }
                      min={1}
                      max={10}
                      step={1}
                      marks
                      valueLabelDisplay="on"
                      color="success"
                    />
                  </Box>
                  <Box display="flex" justifyContent="center" mt={1}>
                    <Chip
                      label={formData.safetyScore}
                      color="success"
                      variant="filled"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Quality Score (1-10)
                  </Typography>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={formData.qualityScore}
                      onChange={(_, value) =>
                        handleInputChange("qualityScore", value)
                      }
                      min={1}
                      max={10}
                      step={1}
                      marks
                      valueLabelDisplay="on"
                      color="primary"
                    />
                  </Box>
                  <Box display="flex" justifyContent="center" mt={1}>
                    <Chip
                      label={formData.qualityScore}
                      color="primary"
                      variant="filled"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Daily Progress Contribution (%)
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.dailyProgressContribution}
                  onChange={(_, value) =>
                    handleInputChange("dailyProgressContribution", value)
                  }
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: "0%" },
                    { value: 25, label: "25%" },
                    { value: 50, label: "50%" },
                    { value: 75, label: "75%" },
                    { value: 100, label: "100%" },
                  ]}
                  valueLabelDisplay="on"
                  color="secondary"
                />
              </Box>
              <Box display="flex" justifyContent="center" mt={1}>
                <Chip
                  label={`${formData.dailyProgressContribution}%`}
                  color="secondary"
                  variant="filled"
                />
              </Box>
            </CardContent>
          </Card>

          <TextField
            label="Additional Notes"
            multiline
            rows={3}
            value={formData.additionalNotes || ""}
            onChange={(e) =>
              handleInputChange("additionalNotes", e.target.value)
            }
            placeholder="Any additional notes or observations..."
            InputProps={{
              startAdornment: <Notes sx={{ mr: 1, color: "action.active" }} />,
            }}
            fullWidth
          />
        </Stack>
      </Box>
    </Fade>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Paper
      elevation={8}
      sx={{
        maxWidth: 800,
        mx: "auto",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📝 Quick Daily Report
        </Typography>
        <Typography variant="body1">
          Create a report in {steps.length} easy steps
        </Typography>
      </Box>

      {/* Progress */}
      <Box sx={{ p: 2, bgcolor: "grey.50" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="body2" color="text.secondary" fontWeight="bold">
            Step {currentStep + 1} of {steps.length}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight="bold">
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "grey.200",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Stepper */}
      <Box sx={{ p: 2 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Zoom in timeout={300}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                          completed || active ? "primary.main" : "grey.300",
                        color: completed || active ? "white" : "grey.600",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {getStepIcon(index)}
                    </Box>
                  </Zoom>
                )}
              >
                <Typography
                  variant="caption"
                  color={currentStep >= index ? "primary" : "text.secondary"}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Form Content */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={4}
          pt={3}
          borderTop="1px solid"
          borderColor="grey.200"
        >
          <Box>
            {currentStep > 0 && (
              <Button
                variant="outlined"
                onClick={handlePrevious}
                startIcon={<NavigateBefore />}
                sx={{ mr: 1 }}
              >
                Previous
              </Button>
            )}
          </Box>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={onCancel}
              startIcon={<Cancel />}
              color="error"
            >
              Cancel
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NavigateNext />}
                size="large"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Send />
                  )
                }
                size="large"
                sx={{
                  background:
                    "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
                  },
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
