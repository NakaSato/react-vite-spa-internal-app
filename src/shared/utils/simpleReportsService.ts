/**
 * Simple Reports Service
 * Lightweight utility for generating basic daily reports
 */

export interface ReportData {
  reportType: string;
  dateRange: {
    start: string;
    end: string;
  };
  generatedAt: string;
  stats?: {
    totalReports?: number;
    averageHours?: number;
    safetyScore?: number;
    qualityScore?: number;
  };
}

export class SimpleReportsService {
  /**
   * Generate a simple text-based report
   */
  static generateTextReport(data: ReportData): string {
    const { reportType, dateRange, generatedAt, stats } = data;

    const reportTitle = this.getReportTitle(reportType);

    let report = `
${reportTitle.toUpperCase()}
${"=".repeat(reportTitle.length)}

Report Period: ${dateRange.start} to ${dateRange.end}
Generated: ${new Date(generatedAt).toLocaleString()}

`;

    if (stats) {
      report += `SUMMARY STATISTICS
------------------
`;
      if (stats.totalReports !== undefined) {
        report += `Total Reports: ${stats.totalReports}\n`;
      }
      if (stats.averageHours !== undefined) {
        report += `Average Hours: ${stats.averageHours.toFixed(1)}\n`;
      }
      if (stats.safetyScore !== undefined) {
        report += `Safety Score: ${stats.safetyScore.toFixed(1)}/10\n`;
      }
      if (stats.qualityScore !== undefined) {
        report += `Quality Score: ${stats.qualityScore.toFixed(1)}/10\n`;
      }
    }

    report += `\n${this.getReportContent(reportType)}`;

    return report;
  }

  /**
   * Generate and download a simple report
   */
  static downloadTextReport(data: ReportData) {
    const reportContent = this.generateTextReport(data);
    const fileName = `${data.reportType}_${data.dateRange.start}_to_${data.dateRange.end}.txt`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Generate CSV format report
   */
  static generateCSVReport(data: ReportData): string {
    const { reportType, dateRange, stats } = data;

    let csv = "Report Type,Start Date,End Date,Generated At\n";
    csv += `${reportType},${dateRange.start},${dateRange.end},${data.generatedAt}\n\n`;

    if (stats) {
      csv += "Metric,Value\n";
      if (stats.totalReports !== undefined)
        csv += `Total Reports,${stats.totalReports}\n`;
      if (stats.averageHours !== undefined)
        csv += `Average Hours,${stats.averageHours}\n`;
      if (stats.safetyScore !== undefined)
        csv += `Safety Score,${stats.safetyScore}\n`;
      if (stats.qualityScore !== undefined)
        csv += `Quality Score,${stats.qualityScore}\n`;
    }

    return csv;
  }

  /**
   * Download CSV report
   */
  static downloadCSVReport(data: ReportData) {
    const csvContent = this.generateCSVReport(data);
    const fileName = `${data.reportType}_${data.dateRange.start}_to_${data.dateRange.end}.csv`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Generate sample data for demonstration
   */
  static generateSampleData(
    reportType: string,
    dateRange: { start: string; end: string }
  ): ReportData {
    const daysDiff = Math.ceil(
      (new Date(dateRange.end).getTime() -
        new Date(dateRange.start).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      stats: {
        totalReports: Math.floor(Math.random() * daysDiff) + 1,
        averageHours: Math.random() * 8 + 4, // 4-12 hours
        safetyScore: Math.random() * 3 + 7, // 7-10
        qualityScore: Math.random() * 2 + 8, // 8-10
      },
    };
  }

  /**
   * Get human-readable report title
   */
  private static getReportTitle(reportType: string): string {
    const titles: Record<string, string> = {
      "daily-summary": "Daily Summary Report",
      "weekly-progress": "Weekly Progress Report",
      "safety-quality": "Safety & Quality Analysis Report",
      "weather-impact": "Weather Impact Report",
    };

    return titles[reportType] || "Daily Report";
  }

  /**
   * Get report-specific content
   */
  private static getReportContent(reportType: string): string {
    const content: Record<string, string> = {
      "daily-summary": `
DAILY ACTIVITIES OVERVIEW
------------------------
This report provides a comprehensive overview of daily activities and productivity metrics
for the specified period. It includes work hours, personnel deployment, and general
progress indicators across all active projects.

KEY HIGHLIGHTS:
• Daily work completion rates
• Resource utilization efficiency
• Overall productivity trends
• Cross-project activity summary
`,
      "weekly-progress": `
WEEKLY PROGRESS ANALYSIS
-----------------------
This report analyzes weekly progress patterns and milestone achievements across
all projects. It provides insights into team performance and project advancement
over the specified weekly periods.

KEY HIGHLIGHTS:
• Weekly milestone completion
• Team performance metrics
• Progress velocity analysis
• Resource allocation efficiency
`,
      "safety-quality": `
SAFETY & QUALITY METRICS
------------------------
This report focuses on safety scores and quality control measures implemented
during the reporting period. It provides detailed analysis of safety compliance
and quality standards adherence.

KEY HIGHLIGHTS:
• Safety incident tracking
• Quality score trends
• Compliance metrics
• Risk assessment indicators
`,
      "weather-impact": `
WEATHER IMPACT ANALYSIS
-----------------------
This report analyzes how weather conditions affected work productivity and
project timelines during the specified period. It correlates weather data
with work completion rates and identifies weather-related delays.

KEY HIGHLIGHTS:
• Weather condition summary
• Productivity correlation analysis
• Weather-related delays
• Mitigation strategies effectiveness
`,
    };

    return (
      content[reportType] ||
      "Report content will be generated based on actual data."
    );
  }
}

export default SimpleReportsService;
