// Chart.js Configuration and Utilities
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Default chart configurations
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Chart color palette
export const chartColors = {
  primary: "#3B82F6",
  secondary: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
  light: "#6B7280",
  success: "#22C55E",
};

// Chart theme configurations
export const chartThemes = {
  light: {
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    gridColor: "#E5E7EB",
  },
  dark: {
    backgroundColor: "#1F2937",
    textColor: "#F9FAFB",
    gridColor: "#374151",
  },
};

// Common chart data transformers
export const chartUtils = {
  formatProgress: (data: Array<{ name: string; value: number }>) => ({
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
          chartColors.info,
        ],
        borderWidth: 0,
      },
    ],
  }),

  formatTimeline: (data: Array<{ date: string; value: number }>) => ({
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Progress",
        data: data.map((item) => item.value),
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        tension: 0.1,
        fill: true,
      },
    ],
  }),
};
