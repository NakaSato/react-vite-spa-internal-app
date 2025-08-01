import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Project, NewProjectForm } from "../../shared/types/project";

// Define ProjectStats interface to match useProjects hook
interface ProjectStats {
  totalProjects: number;
  totalBudget: number;
  totalSpent: number;
  totalCapacity: number;
  budgetUtilization?: number;
  statusDistribution?: Record<string, number>;
  activeProjects?: number;
}

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#2563EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 8,
    width: "22%",
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  statLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 3,
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    padding: 8,
    fontWeight: "bold",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 8,
    fontSize: 9,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableCell: {
    flex: 1,
    padding: 2,
  },
  tableCellHeader: {
    flex: 1,
    padding: 2,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 8,
    textAlign: "center",
  },
  statusPlanning: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  statusConstruction: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
  },
  statusCompleted: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  statusOnHold: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#6B7280",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    fontSize: 10,
  },
  summaryLabel: {
    color: "#6B7280",
  },
  summaryValue: {
    fontWeight: "bold",
    color: "#1F2937",
  },
});

interface ProjectReportProps {
  projects: Project[];
  stats: ProjectStats;
  reportType: "overview" | "detailed" | "financial";
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

const ProjectReport: React.FC<ProjectReportProps> = ({
  projects,
  stats,
  reportType,
  dateRange,
}) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "planning":
        return styles.statusPlanning;
      case "construction":
        return styles.statusConstruction;
      case "completed":
        return styles.statusCompleted;
      case "on hold":
        return styles.statusOnHold;
      default:
        return styles.statusPlanning;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Solar Projects Report</Text>
            <Text style={styles.subtitle}>
              Generated on{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            {dateRange && (
              <Text style={styles.subtitle}>
                Period: {formatDate(dateRange.startDate)} -{" "}
                {formatDate(dateRange.endDate)}
              </Text>
            )}
          </View>
          <View>
            <Text style={[styles.subtitle, { textAlign: "right" }]}>
              Report Type:{" "}
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
            </Text>
            <Text style={[styles.subtitle, { textAlign: "right" }]}>
              Total Projects: {projects.length}
            </Text>
          </View>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalProjects}</Text>
              <Text style={styles.statLabel}>Total Projects</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {stats.totalCapacity.toFixed(1)}kW
              </Text>
              <Text style={styles.statLabel}>Total Capacity</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatCurrency(stats.totalBudget)}
              </Text>
              <Text style={styles.statLabel}>Total Budget</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {stats.activeProjects || stats.totalProjects}
              </Text>
              <Text style={styles.statLabel}>Active Projects</Text>
            </View>
          </View>
        </View>

        {/* Project Status Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Status Breakdown</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Planning:</Text>
            <Text style={styles.summaryValue}>
              {projects.filter((p) => p.status === "Planning").length} projects
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Construction:</Text>
            <Text style={styles.summaryValue}>
              {projects.filter((p) => p.status === "Construction").length}{" "}
              projects
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completed:</Text>
            <Text style={styles.summaryValue}>
              {projects.filter((p) => p.status === "Completed").length} projects
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Permits:</Text>
            <Text style={styles.summaryValue}>
              {projects.filter((p) => p.status === "Permits").length} projects
            </Text>
          </View>
        </View>

        {/* Projects Table */}
        {reportType !== "overview" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Details</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCellHeader}>Project Name</Text>
                <Text style={styles.tableCellHeader}>Status</Text>
                <Text style={styles.tableCellHeader}>System Size</Text>
                <Text style={styles.tableCellHeader}>Start Date</Text>{" "}
                {reportType === "financial" && (
                  <Text style={styles.tableCellHeader}>Budget</Text>
                )}
              </View>
              {projects.slice(0, 15).map((project, index) => (
                <View
                  key={project.id}
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={styles.tableCell}>{project.name}</Text>
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        styles.statusBadge,
                        getStatusStyle(project.status),
                      ]}
                    >
                      {project.status}
                    </Text>
                  </View>
                  <Text style={styles.tableCell}>{project.systemSize}</Text>
                  <Text style={styles.tableCell}>
                    {formatDate(project.startDate)}
                  </Text>
                  {reportType === "financial" && (
                    <Text style={styles.tableCell}>
                      {formatCurrency(project.budget)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Financial Summary for Financial Reports */}
        {reportType === "financial" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Budget:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Spent:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(projects.reduce((sum, p) => sum + p.spent, 0))}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Average Project Budget:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  projects.reduce((sum, p) => sum + p.budget, 0) /
                    projects.length
                )}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Budget Utilization:</Text>
              <Text style={styles.summaryValue}>
                {(
                  (projects.reduce((sum, p) => sum + p.spent, 0) /
                    projects.reduce((sum, p) => sum + p.budget, 0)) *
                  100
                ).toFixed(1)}
                %
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Solar Projects Management System | Internal Construction Company |
          Page 1
        </Text>
      </Page>
    </Document>
  );
};

export default ProjectReport;
