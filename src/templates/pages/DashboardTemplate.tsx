import { Refresh, TrendingDown, TrendingUp } from "@mui/icons-material";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

interface DashboardMetric {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
}

interface DashboardSection {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  refreshable?: boolean;
  onRefresh?: () => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface DashboardTemplateProps {
  /** Dashboard title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Header actions */
  headerActions?: React.ReactNode;
  /** Key metrics to display at the top */
  metrics?: DashboardMetric[];
  /** Main dashboard content sections */
  children: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Refresh all data */
  onRefreshAll?: () => void;
  /** Custom header content */
  headerContent?: React.ReactNode;
}

/**
 * DashboardTemplate
 *
 * Comprehensive dashboard template for analytics and KPI display.
 * Optimized for solar project management with Thai/English content support.
 *
 * Features:
 * - Responsive metric cards with trend indicators
 * - Flexible grid layout for charts and data
 * - Consistent spacing and typography
 * - Sarabun font integration
 * - MUI + Tailwind hybrid styling
 * - Real-time data refresh capabilities
 * - Mobile-optimized layout
 *
 * @example
 * ```tsx
 * <DashboardTemplate
 *   title="แดชบอร์ดโครงการ Project Dashboard"
 *   subtitle="ภาพรวมโครงการโซลาร์ทั้งหมด Overview of all solar projects"
 *   metrics={[
 *     {
 *       title: "โครงการทั้งหมด Total Projects",
 *       value: 45,
 *       trend: { value: 12, isPositive: true, label: "เดือนนี้ This month" },
 *       icon: <SolarPower />,
 *       color: "primary"
 *     }
 *   ]}
 *   onRefreshAll={handleRefresh}
 * >
 *   <DashboardSection title="การวิเคราะห์ Analytics">
 *     <ChartComponent />
 *   </DashboardSection>
 * </DashboardTemplate>
 * ```
 */
export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  title,
  subtitle,
  headerActions,
  metrics = [],
  children,
  loading = false,
  onRefreshAll,
  headerContent,
}) => {
  const theme = useTheme();

  return (
    <Box className="min-h-screen bg-gray-50">
      <Container maxWidth="xl" className="py-6">
        {/* Header */}
        <Paper elevation={1} className="mb-6 rounded-xl p-6">
          <Box className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title Section */}
            <Box className="flex-1">
              <Typography
                variant="h4"
                className="font-sarabun-semibold mb-2 text-gray-800"
                sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                {title}
              </Typography>

              {subtitle && (
                <Typography
                  variant="subtitle1"
                  className="font-sarabun-regular text-gray-600"
                >
                  {subtitle}
                </Typography>
              )}

              {/* Custom Header Content */}
              {headerContent && <Box className="mt-3">{headerContent}</Box>}
            </Box>

            {/* Header Actions */}
            <Box className="flex items-center gap-2">
              {onRefreshAll && (
                <IconButton
                  onClick={onRefreshAll}
                  disabled={loading}
                  size="small"
                  className="text-gray-600 hover:text-gray-800"
                  title="รีเฟรชข้อมูล Refresh Data"
                >
                  <Refresh className={loading ? "animate-spin" : ""} />
                </IconButton>
              )}
              {headerActions}
            </Box>
          </Box>
        </Paper>

        {/* Metrics Section */}
        {metrics.length > 0 && (
          <Box className="mb-6">
            <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} loading={loading} />
              ))}
            </Box>
          </Box>
        )}

        {/* Main Content */}
        <Box>{children}</Box>
      </Container>
    </Box>
  );
};

/**
 * MetricCard Component
 *
 * Individual metric display card with trend indicators
 */
interface MetricCardProps {
  metric: DashboardMetric;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, loading }) => {
  const theme = useTheme();
  const colorKey = metric.color || "primary";

  return (
    <Card
      elevation={2}
      className="h-full rounded-xl transition-shadow hover:shadow-lg"
      sx={{
        borderLeft: `4px solid ${theme.palette[colorKey].main}`,
      }}
    >
      <CardContent className="p-4">
        <Box className="mb-3 flex items-start justify-between">
          <Box className="flex-1">
            <Typography
              variant="body2"
              className="font-sarabun-medium mb-1 text-gray-600"
            >
              {metric.title}
            </Typography>
            <Typography
              variant="h4"
              className="font-sarabun-bold"
              sx={{
                color: theme.palette[colorKey].main,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {loading ? "..." : metric.value}
            </Typography>
          </Box>
          {metric.icon && (
            <Box
              className="rounded-lg p-2"
              sx={{
                backgroundColor: alpha(theme.palette[colorKey].main, 0.1),
                color: theme.palette[colorKey].main,
              }}
            >
              {metric.icon}
            </Box>
          )}
        </Box>

        {metric.subtitle && (
          <Typography
            variant="caption"
            className="font-sarabun-regular mb-2 block text-gray-500"
          >
            {metric.subtitle}
          </Typography>
        )}

        {metric.trend && (
          <Box className="flex items-center gap-1">
            {metric.trend.isPositive ? (
              <TrendingUp className="text-green-500" fontSize="small" />
            ) : (
              <TrendingDown className="text-red-500" fontSize="small" />
            )}
            <Typography
              variant="caption"
              className={`font-sarabun-medium ${
                metric.trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {metric.trend.value > 0 ? "+" : ""}
              {metric.trend.value}%
            </Typography>
            {metric.trend.label && (
              <Typography
                variant="caption"
                className="font-sarabun-regular text-gray-500"
              >
                {metric.trend.label}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * DashboardSection Component
 *
 * Reusable section component for organizing dashboard content
 */
export const DashboardSection: React.FC<DashboardSection> = ({
  title,
  subtitle,
  children,
  actions,
  refreshable = false,
  onRefresh,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        await onRefresh();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card elevation={1} className="mb-6 rounded-xl">
      <CardContent className="p-6">
        <Box className="mb-4 flex items-center justify-between">
          <Box>
            <Typography
              variant="h6"
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
          <Box className="flex items-center gap-2">
            {refreshable && (
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                size="small"
                className="text-gray-600 hover:text-gray-800"
                title="รีเฟรชข้อมูล Refresh Data"
              >
                <Refresh className={loading ? "animate-spin" : ""} />
              </IconButton>
            )}
            {actions}
          </Box>
        </Box>
        <Divider className="mb-4" />
        <Box className={loading ? "pointer-events-none opacity-50" : ""}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * DashboardGrid Component
 *
 * Responsive grid layout for dashboard widgets
 */
interface DashboardGridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  columns = { xs: 1, md: 2, lg: 3, xl: 4 },
}) => {
  const gridCols = {
    xs: `grid-cols-${columns.xs || 1}`,
    sm: columns.sm ? `sm:grid-cols-${columns.sm}` : "",
    md: columns.md ? `md:grid-cols-${columns.md}` : "",
    lg: columns.lg ? `lg:grid-cols-${columns.lg}` : "",
    xl: columns.xl ? `xl:grid-cols-${columns.xl}` : "",
  };

  const gridClass = Object.values(gridCols).filter(Boolean).join(" ");

  return <Box className={`grid ${gridClass} gap-6`}>{children}</Box>;
};

export default DashboardTemplate;
