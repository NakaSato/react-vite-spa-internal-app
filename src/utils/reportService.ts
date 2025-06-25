import React from "react";
import { Project } from "../types/project";

export interface ProjectStats {
  totalProjects: number;
  totalBudget: number;
  totalSpent: number;
  totalCapacity: number;
  budgetUtilization?: number;
  statusDistribution?: Record<string, number>;
  activeProjects?: number;
}

export interface ReportOptions {
  reportType: "overview" | "detailed" | "financial";
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  filename?: string;
}

export class ReportService {
  /**
   * Dynamically import PDF dependencies to reduce bundle size
   */
  private static async loadPdfDependencies() {
    const [{ pdf, Document }, ProjectReport] = await Promise.all([
      import("@react-pdf/renderer"),
      import("../components/ProjectReport"),
    ]);

    return { pdf, Document, ProjectReport: ProjectReport.default };
  }

  /**
   * Generate and download a PDF report
   */
  static async generateAndDownloadReport(
    projects: Project[],
    stats: ProjectStats,
    options: ReportOptions
  ): Promise<void> {
    try {
      // Dynamically load PDF dependencies
      const { pdf, Document, ProjectReport } = await this.loadPdfDependencies();

      // Create the PDF document using React.createElement
      const doc = React.createElement(
        Document,
        {},
        React.createElement(ProjectReport, {
          projects,
          stats,
          reportType: options.reportType,
          dateRange: options.dateRange,
        })
      );

      // Generate the PDF blob
      const blob = await pdf(doc).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Set filename
      const timestamp = new Date().toISOString().split("T")[0];
      const filename =
        options.filename ||
        `solar-projects-${options.reportType}-report-${timestamp}.pdf`;

      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Report generated successfully: ${filename}`);
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
      throw new Error("Failed to generate PDF report. Please try again.");
    }
  }

  /**
   * Generate PDF blob without downloading (for preview or sending)
   */
  static async generateReportBlob(
    projects: Project[],
    stats: ProjectStats,
    options: ReportOptions
  ): Promise<Blob> {
    try {
      // Dynamically load PDF dependencies
      const { pdf, Document, ProjectReport } = await this.loadPdfDependencies();

      const doc = React.createElement(
        Document,
        {},
        React.createElement(ProjectReport, {
          projects,
          stats,
          reportType: options.reportType,
          dateRange: options.dateRange,
        })
      );

      return await pdf(doc).toBlob();
    } catch (error) {
      console.error("Failed to generate PDF blob:", error);
      throw new Error("Failed to generate PDF. Please try again.");
    }
  }

  /**
   * Generate base64 encoded PDF (for email attachments)
   */
  static async generateReportBase64(
    projects: Project[],
    stats: ProjectStats,
    options: ReportOptions
  ): Promise<string> {
    try {
      const blob = await this.generateReportBlob(projects, stats, options);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            // Remove the data:application/pdf;base64, prefix
            const base64 = reader.result.split(",")[1];
            resolve(base64);
          } else {
            reject(new Error("Failed to convert to base64"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to generate base64 PDF:", error);
      throw new Error("Failed to generate PDF. Please try again.");
    }
  }

  /**
   * Filter projects by date range
   */
  static filterProjectsByDateRange(
    projects: Project[],
    startDate: string,
    endDate: string
  ): Project[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return projects.filter((project) => {
      const projectDate = new Date(project.startDate);
      return projectDate >= start && projectDate <= end;
    });
  }

  /**
   * Calculate stats for filtered projects
   */
  static calculateFilteredStats(projects: Project[]): ProjectStats {
    return {
      totalProjects: projects.length,
      totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
      totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
      totalCapacity: projects.length, // Using project count as capacity measure
      activeProjects: projects.filter(
        (p) =>
          p.status === "Construction" ||
          p.status === "Planning" ||
          p.status === "Design"
      ).length,
      budgetUtilization:
        projects.reduce((sum, p) => sum + p.budget, 0) > 0
          ? (projects.reduce((sum, p) => sum + p.spent, 0) /
              projects.reduce((sum, p) => sum + p.budget, 0)) *
            100
          : 0,
      statusDistribution: projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  /**
   * Generate report with date filtering
   */
  static async generateFilteredReport(
    projects: Project[],
    stats: ProjectStats,
    startDate: string,
    endDate: string,
    reportType: "overview" | "detailed" | "financial" = "overview"
  ): Promise<void> {
    const filteredProjects = this.filterProjectsByDateRange(
      projects,
      startDate,
      endDate
    );
    const filteredStats = this.calculateFilteredStats(filteredProjects);

    await this.generateAndDownloadReport(filteredProjects, filteredStats, {
      reportType,
      dateRange: { startDate, endDate },
      filename: `solar-projects-${reportType}-${startDate}-to-${endDate}.pdf`,
    });
  }
}

export default ReportService;
