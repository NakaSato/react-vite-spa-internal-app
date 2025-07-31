import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Fade,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: 'url("/images/dashboard.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(30,58,138,0.5) 50%, rgba(0,0,0,0.8) 100%)",
    zIndex: 1,
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "white",
  maxWidth: "1200px",
  width: "100%",
  padding: theme.spacing(4),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(4),
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down("md")]: {
    gap: theme.spacing(3),
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  position: "relative",
  "&:hover": {
    transform: "scale(1.05)",
  },
  transition: "transform 0.5s ease",
}));

const LogoAvatar = styled(Avatar)(({ theme }) => ({
  width: 200,
  height: 200,
  backgroundColor: "white",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  border: "4px solid rgba(255,255,255,0.3)",
  [theme.breakpoints.down("md")]: {
    width: 150,
    height: 150,
  },
  [theme.breakpoints.down("sm")]: {
    width: 120,
    height: 120,
  },
  "&:hover": {
    boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
  },
  transition: "all 0.3s ease",
}));

const PartnershipCard = styled(Card)(({ theme }) => ({
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(6),
  "&:hover": {
    background: "rgba(255,255,255,0.15)",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  transition: "all 0.3s ease",
}));

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HeroContainer>
      <Container maxWidth="lg">
        <Fade in={isLoaded} timeout={1000}>
          <ContentBox>
            {/* Logo Section */}
            <LogoContainer>
              <LogoBox>
                <LogoAvatar
                  src="/images/pea_logo.png"
                  alt="Provincial Electricity Authority"
                  imgProps={{
                    onError: (e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    },
                  }}
                />
              </LogoBox>
              <LogoBox>
                <LogoAvatar
                  src="/images/pwa_logo.png"
                  alt="PWA - Solar Energy Partner"
                  imgProps={{
                    onError: (e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    },
                  }}
                />
              </LogoBox>
            </LogoContainer>

            {/* Partnership Badge */}
            <PartnershipCard>
              <CardContent sx={{ py: 4 }}>
                <Typography
                  variant={isMobile ? "h6" : "h4"}
                  component="h2"
                  fontWeight="600"
                  color="white"
                  sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  โครงการจัดการพลังงานไฟฟ้าจากระบบผลิตไฟฟ้าพลังงานแสงอาทิตย์
                </Typography>
              </CardContent>
            </PartnershipCard>

            {/* Content Section */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                component="h1"
                gutterBottom
                fontWeight="300"
                sx={{
                  color: "white",
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  mb: 2,
                }}
              >
                ระบบจัดการโครงการก่อสร้างภายในองค์กร
              </Typography>
              <Typography
                variant={isMobile ? "h6" : "h4"}
                component="h2"
                sx={{
                  color: "rgba(147, 197, 253, 1)",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  mb: 6,
                }}
              >
                Internal Construction Management System
              </Typography>

              {/* Call to Action */}
              <Stack
                direction="column"
                spacing={3}
                alignItems="center"
                sx={{ mt: 4 }}
              >
                {isAuthenticated ? (
                  <ActionButton
                    variant="contained"
                    size="large"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate("/dashboard")}
                    sx={{
                      background:
                        "linear-gradient(135deg, #475569 0%, #334155 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
                      },
                    }}
                  >
                    เข้าสู่ระบบจัดการโครงการ
                  </ActionButton>
                ) : (
                  <ActionButton
                    variant="contained"
                    size="large"
                    startIcon={<LoginIcon />}
                    onClick={() => navigate("/login")}
                    sx={{
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #3730a3 0%, #312e81 100%)",
                      },
                    }}
                  >
                    เข้าสู่ระบบ
                  </ActionButton>
                )}

                {isAuthenticated && user && (
                  <Chip
                    label={`ยินดีต้อนรับ ${user.fullName} (${user.roleName})`}
                    color="primary"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  />
                )}
              </Stack>
            </Box>
          </ContentBox>
        </Fade>
      </Container>
    </HeroContainer>
  );
};

export default Home;
