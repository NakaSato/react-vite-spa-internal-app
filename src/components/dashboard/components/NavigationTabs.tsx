import {
  Box,
  Button,
  Card,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

export const NavigationTabs = () => {
  const theme = useTheme();
  const currentTime = new Date().toLocaleTimeString();

  const tabs = [
    { label: "Overview", icon: "📊", active: true },
    { label: "Projects", icon: "🏗️", active: false },
    { label: "Reports", icon: "📈", active: false },
    { label: "Daily Reports", icon: "📝", active: false },
    { label: "Construction", icon: "⚡", active: false },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          p: { xs: 2, md: 3 },
          flexDirection: { xs: "row", md: "row" },
          gap: { xs: 1, md: 2 },
          overflow: { xs: "hidden", md: "visible" },
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 0.5, md: 1 }}
          sx={{
            flexWrap: { xs: "nowrap", md: "wrap" },
            overflowX: { xs: "auto", md: "visible" },
            overflowY: "hidden",
            gap: { xs: 0.5, md: 1 },
            minWidth: 0,
            flex: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            pb: { xs: 0.5, md: 0 },
            mb: { xs: -0.5, md: 0 },
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              variant={tab.active ? "contained" : "text"}
              startIcon={
                <Typography component="span" sx={{ fontSize: "1.25rem" }}>
                  {tab.icon}
                </Typography>
              }
              sx={{
                fontWeight: 500,
                textTransform: "none",
                borderRadius: 2,
                px: { xs: 1.5, md: 2 },
                py: { xs: 0.75, md: 1 },
                fontSize: { xs: "0.8rem", md: "0.875rem" },
                minWidth: { xs: "auto", md: "auto" },
                flexShrink: 0,
                whiteSpace: "nowrap",
                ...(tab.active
                  ? {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                      },
                    }
                  : {
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.text.primary,
                      },
                    }),
                transition: "all 0.2s ease-in-out",
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={{ xs: 1, md: 2 }}
          alignItems="center"
          sx={{
            display: { xs: "none", sm: "flex" },
            flexShrink: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.75rem", md: "0.875rem" },
            }}
          >
            Last updated: {currentTime}
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: theme.palette.success.main,
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": {
                  opacity: 1,
                },
                "50%": {
                  opacity: 0.5,
                },
              },
            }}
          />
        </Stack>
      </Box>
    </Card>
  );
};

export default NavigationTabs;
