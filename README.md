# Solar Projects Management SPA

A comprehensive React + TypeScript SPA for solar project management with authentication, role-based access control, and professional PDF reporting capabilities.

## 🌟 Features

### Core Functionality
- **Project Management**: Complete CRUD operations for solar projects
- **Dashboard Analytics**: Real-time statistics and project insights
- **Role-Based Access**: Admin, Manager, User, and Viewer roles with appropriate permissions
- **Authentication**: JWT-based auth with token refresh and secure storage
- **API Integration**: Full API integration with environment-based configuration

### PDF Report Generation
- **Professional Reports**: Generate high-quality PDF reports using @react-pdf/renderer
- **Multiple Report Types**: 
  - Overview: High-level summary and statistics
  - Detailed: Complete project listings with specifications
  - Financial: Budget analysis and financial metrics
- **Date Range Filtering**: Filter reports by project start date ranges
- **Automatic Download**: Client-side PDF generation and download

### Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build**: Vite with Bun package manager
- **Testing**: Vitest + React Testing Library
- **PDF Generation**: @react-pdf/renderer with custom layouts
- **Auth**: JWT with role-based access control
- **API**: Type-safe client with environment switching

## 🚀 Getting Started

### Prerequisites

- Bun (recommended) or Node.js 18+
- Modern browser with ES6 support

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-vite-spa
   ```

2. Install dependencies using Bun:
   ```bash
   bun install
   ```

### Running the Application

#### Development
```bash
bun dev
```

#### Build for Production
```bash
bun build
```

#### Run Tests
```bash
bun test
```

or

```bash
yarn dev
```

Open your browser and navigate to `http://localhost:3000` to see the application in action.

### Building for Production

To create a production build, run:

```bash
npm run build
```

or

```bash
yarn build
```

The build artifacts will be stored in the `dist` directory.

## Project Structure

- `src/`: Contains the source code for the application.
  - `main.tsx`: Entry point of the application.
  - `App.tsx`: Main application component.
  - `components/`: Reusable components.
  - `pages/`: Main page components.
  - `hooks/`: Custom hooks.
  - `utils/`: Utility functions.
  - `types/`: TypeScript interfaces and types.
- `public/`: Static assets.
- `index.html`: Main HTML template.
- `package.json`: Project metadata and dependencies.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite configuration.
- `tailwind.config.js`: Tailwind CSS configuration.
- `postcss.config.js`: PostCSS configuration.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.