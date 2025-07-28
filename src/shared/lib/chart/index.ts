// Chart Utilities
export * from "./chartConfig";

// Chart helper functions
export const generateChartId = () =>
  `chart-${Math.random().toString(36).substring(2, 15)}`;

export const resizeChart = (chartRef: any) => {
  if (chartRef?.current) {
    chartRef.current.resize();
  }
};

export const downloadChart = (chartRef: any, filename: string = "chart") => {
  if (chartRef?.current) {
    const url = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = url;
    link.click();
  }
};
