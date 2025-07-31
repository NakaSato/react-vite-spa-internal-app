import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  Alert,
} from "@mui/material";
import { Preview, Style, AccountCircle, Assignment } from "@mui/icons-material";
import LoginFormMUI from "../../features/auth/LoginFormMUI";
import RegisterFormMUI from "../../features/auth/RegisterFormMUI";
import QuickReportFormMUI from "../../components/QuickReportFormMUI";

type DemoComponent = "login" | "register" | "report";

export default function MUIShowcase() {
  const [activeDemo, setActiveDemo] = useState<DemoComponent | null>(null);

  const handleReportSubmit = async (data: any) => {
    console.log("Report submitted:", data);
    alert("Report submitted successfully! Check console for data.");
  };

  const handleReportCancel = () => {
    setActiveDemo(null);
  };

  const demoCards = [
    {
      id: "login" as DemoComponent,
      title: "Login Form MUI",
      description:
        "Modern login form with Material-UI components, animations, and validation",
      icon: <AccountCircle sx={{ fontSize: 40 }} />,
      features: [
        "Email validation",
        "Password visibility toggle",
        "Smooth animations",
        "Test account chips",
      ],
    },
    {
      id: "register" as DemoComponent,
      title: "Register Form MUI",
      description:
        "Comprehensive registration with password strength and form validation",
      icon: <Style sx={{ fontSize: 40 }} />,
      features: [
        "Password strength meter",
        "Form validation",
        "Role selection",
        "Responsive design",
      ],
    },
    {
      id: "report" as DemoComponent,
      title: "Quick Report Form MUI",
      description:
        "Multi-step form with progress tracking, sliders, and interactive components",
      icon: <Assignment sx={{ fontSize: 40 }} />,
      features: [
        "4-step wizard",
        "Interactive sliders",
        "Weather selection",
        "Progress tracking",
      ],
    },
  ];

  if (activeDemo) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={3}>
          <Button
            onClick={() => setActiveDemo(null)}
            startIcon={<Preview />}
            variant="outlined"
          >
            ← Back to Showcase
          </Button>
        </Box>

        {activeDemo === "login" && (
          <LoginFormMUI
            onSuccess={() => alert("Login demo - form submitted!")}
          />
        )}

        {activeDemo === "register" && (
          <RegisterFormMUI
            onSuccess={() => alert("Register demo - form submitted!")}
            onSwitchToLogin={() => setActiveDemo("login")}
          />
        )}

        {activeDemo === "report" && (
          <QuickReportFormMUI
            projectId="demo-project"
            onSubmit={handleReportSubmit}
            onCancel={handleReportCancel}
          />
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          🎨 Material-UI Showcase
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Interactive preview of migrated components
        </Typography>
      </Paper>

      {/* Migration Status */}
      <Alert severity="success" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          ✅ Phase 1 Migration Complete
        </Typography>
        <Typography>
          Authentication forms and quick report form have been successfully
          migrated to Material-UI with modern design patterns, animations, and
          enhanced user experience.
        </Typography>
      </Alert>

      {/* Component Cards */}
      <Grid container spacing={3}>
        {demoCards.map((card) => (
          <Grid size={{ xs: 12, md: 4 }} key={card.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      mr: 2,
                      color: "primary.main",
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "primary.50",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {card.title}
                  </Typography>
                </Box>

                <Typography color="text.secondary" paragraph>
                  {card.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Key Features:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {card.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setActiveDemo(card.id)}
                  startIcon={<Preview />}
                  sx={{
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                    },
                  }}
                >
                  View Demo
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Technical Details */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          🔧 Technical Implementation
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              MUI Packages Used:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>@mui/material ^7.2.0</li>
              <li>@mui/icons-material ^7.2.0</li>
              <li>@mui/lab ^7.0.0-beta.14</li>
              <li>@mui/x-charts</li>
              <li>@fontsource/roboto</li>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Key Features:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Custom theme integration</li>
              <li>Responsive design system</li>
              <li>Animation and transitions</li>
              <li>Accessibility compliance</li>
              <li>TypeScript integration</li>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
