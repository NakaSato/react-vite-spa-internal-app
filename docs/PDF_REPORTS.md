# PDF Report Generation

This document explains how to use the PDF report generation functionality in the Solar Projects SPA.

## Overview

The application uses `@react-pdf/renderer` to generate high-quality PDF reports from React components. This provides structured, professional reports for solar project management.

## Features

### Report Types

1. **Overview Report**: High-level summary with project statistics and status distribution
2. **Detailed Report**: Complete project listings with details and specifications
3. **Financial Report**: Budget analysis, spending breakdown, and financial metrics

### Date Range Filtering

- Optional date range filtering for all report types
- Filter projects by start date range
- Automatic recalculation of statistics for filtered data

### Export Options

- Automatic PDF download to user's default download folder
- Customizable filename with timestamp
- Professional formatting with company branding

## Usage

### Accessing Reports

1. Navigate to the Dashboard
2. Click on the "Reports" tab
3. Use the PDF Report Generation section

### Generating Reports

1. **Set Date Range (Optional)**:
   - Select start and end dates to filter projects
   - Leave blank to include all projects

2. **Choose Report Type**:
   - Click "Generate Overview Report" for summary data
   - Click "Generate Detailed Report" for complete project listings
   - Click "Generate Financial Report" for budget analysis

3. **Download**:
   - PDF will automatically download when generation is complete
   - Success message will confirm generation

## Technical Implementation

### Components

- `ProjectReport.tsx`: React PDF component defining the report layout
- `ReportsTab.tsx`: UI component with generation controls
- `reportService.ts`: Service class handling PDF generation and download

### Dependencies

```json
{
  "@react-pdf/renderer": "^4.0.0"
}
```

### Key Files

```
src/
├── components/
│   ├── ProjectReport.tsx      # PDF document component
│   └── ReportsTab.tsx         # Report generation UI
├── utils/
│   └── reportService.ts       # PDF generation service
└── types/
    └── project.ts            # TypeScript interfaces
```

## Development

### Adding New Report Types

1. Add new report type to `ReportOptions` interface in `reportService.ts`
2. Update `ProjectReport.tsx` to handle new report type rendering
3. Add new button in `ReportsTab.tsx` for the new report type

### Customizing Report Layout

Edit `ProjectReport.tsx`:
- Modify `styles` object for styling changes
- Update component structure for layout changes
- Add new sections by creating additional `View` components

### Performance Considerations

- Large datasets may take longer to generate
- Consider pagination for reports with many projects
- Bundle size increases significantly with @react-pdf/renderer

## Error Handling

- Validation for empty project arrays
- Date range validation (start date before end date)
- Network error handling for API data
- User-friendly error messages

## Browser Compatibility

- Modern browsers with ES6 support
- File download functionality requires modern browser APIs
- PDF generation happens client-side

## Troubleshooting

### Common Issues

1. **Build Size Warning**: Expected due to @react-pdf/renderer size
2. **Slow Generation**: Large project arrays may take time to process
3. **Download Fails**: Check browser popup/download blockers

### Development Tips

- Use mock data during development for faster testing
- Test with various project array sizes
- Verify PDF content with different browsers
- Check mobile compatibility for download behavior

## Future Enhancements

- Email integration for sending reports
- Custom report templates
- Chart/graph integration
- Multi-page support for large datasets
- Print preview functionality
- Report scheduling/automation
