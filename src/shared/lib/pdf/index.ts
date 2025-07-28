// PDF Configuration for @react-pdf/renderer
import { Font } from "@react-pdf/renderer";

// Register custom fonts if needed
// Font.register({
//   family: 'Roboto',
//   src: '/fonts/Roboto-Regular.ttf'
// });

// PDF styling constants
export const pdfStyles = {
  page: {
    flexDirection: "column" as const,
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center" as const,
    color: "#1F2937",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 15,
    color: "#374151",
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
    color: "#4B5563",
  },
  table: {
    display: "table" as const,
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row" as const,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
};

// PDF page formats
export const pageFormats = {
  A4: { width: 595, height: 842 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
};

// PDF generation utilities
export const pdfUtils = {
  formatDate: (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  generateFileName: (type: string, projectName?: string): string => {
    const timestamp = new Date().toISOString().split("T")[0];
    const name = projectName ? `${projectName}-` : "";
    return `${name}${type}-${timestamp}.pdf`;
  },
};
