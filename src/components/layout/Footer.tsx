import {
  alpha,
  Box,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { NavbarApiStatus } from "../../widgets";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  const footerLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Security", href: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: theme.palette.primary.main,
        color: "#ffffff",
        borderTop: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1.5, sm: 3, md: 4, lg: 6 },
          py: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Stack spacing={{ xs: 3, sm: 4, md: 5 }}>
          {/* Top Section - Copyright and Team */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "center", sm: "center" }}
            spacing={{ xs: 2.5, sm: 3, md: 0 }}
            sx={{
              flexWrap: { sm: "wrap", md: "nowrap" },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              spacing={{ xs: 1.5, sm: 2, md: 3 }}
              sx={{
                textAlign: { xs: "center", sm: "left" },
                flex: 1,
                maxWidth: { sm: "100%", md: "none" },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: alpha("#ffffff", 0.9),
                  fontWeight: 500,
                  fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.9rem" },
                  lineHeight: { xs: 1.4, sm: 1.5 },
                  letterSpacing: 0.25,
                }}
              >
                © {currentYear} Solar Projects Management. All rights reserved.
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 1, sm: 1.5 }}
                sx={{
                  color: alpha("#ffffff", 0.7),
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    color: "inherit",
                  }}
                >
                  •
                </Typography>
                <Typography variant="caption" sx={{ color: "inherit" }}>
                  - GridTokenX Team
                </Typography>
              </Stack>
            </Stack>

            {/* API Status */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: { xs: 0, sm: 0 },
                order: { xs: 2, sm: 1, md: 2 },
                flexShrink: 0,
              }}
            >
              <NavbarApiStatus
                className="inline-flex"
                compact={true}
                showDetails={false}
              />
            </Box>
          </Stack>

          {/* Bottom Section - Links */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "center", md: "flex-end" }}
            alignItems="center"
            spacing={{ xs: 2, sm: 3, md: 0 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 2, md: 4 }}
              sx={{
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {footerLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: { xs: 40, sm: 44 },
                    px: { xs: 2, sm: 2, md: 3 },
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: { xs: 2, sm: 1.5 },
                    color: alpha("#ffffff", 0.75),
                    fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.9rem" },
                    fontWeight: 500,
                    letterSpacing: 0.25,
                    transition: "all 0.3s ease",
                    touchAction: "manipulation",
                    border: `1px solid transparent`,
                    "&:hover": {
                      color: "#ffffff",
                      bgcolor: alpha(theme.palette.primary.light, 0.15),
                      borderColor: alpha("#ffffff", 0.2),
                      transform: "translateY(-1px)",
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.dark, 0.3)}`,
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Stack>

          {/* Mobile-only separator and system info */}
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <Divider
              sx={{
                borderColor: alpha("#ffffff", 0.25),
                mb: 3,
                mx: 2,
              }}
            />
            <Stack spacing={1.5} sx={{ textAlign: "center", px: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: alpha("#ffffff", 0.8),
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: 0.5,
                  lineHeight: 1.4,
                }}
              >
                Internal Construction Management System
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: alpha("#ffffff", 0.85),
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: 0.25,
                  lineHeight: 1.4,
                }}
              >
                ระบบจัดการโครงการก่อสร้างภายในองค์กร
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
