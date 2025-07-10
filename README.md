# Solar Projects Management SPA

A comprehensive React + TypeScript SPA for solar project management with authentication, role-based access control, real-time updates, and daily reporting capabilities.

## 🌟 Features

### Core Functionality
- **Project Management**: Complete CRUD operations for solar projects with status tracking
- **Dashboard Analytics**: Real-time statistics, project insights, and progress monitoring
- **Role-Based Access**: Admin, Manager, User, and Viewer roles with appropriate permissions
- **Authentication**: JWT-based auth with token refresh and secure storage
- **API Integration**: Full API integration with environment-based configuration (Docker/Azure)

### Real-Time Features
- **Live Project Dashboard**: Real-time project updates and notifications
- **Daily Reports**: Comprehensive daily reporting system with approval workflows
- **Status Management**: Real-time project status updates with approval requirements
- **Notifications**: Live notifications for project updates and system events

### Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build**: Vite with Bun package manager  
- **Testing**: Vitest + React Testing Library
- **Auth**: JWT with role-based access control
- **API**: Type-safe client with environment switching (local Docker/Azure prod)
- **State Management**: React Context + Custom Hooks

## 🚀 Getting Started

### Prerequisites

- Bun (recommended) or Node.js 18+
- Modern browser with ES6 support
- Backend API running (local Docker or Azure)

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

## 📁 Project Structure

```
src/
├── app/                   # App routing and configuration
├── components/            # Reusable UI components
├── features/              # Feature-based modules
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard and overview
│   ├── projects/         # Project management
│   └── reports/          # Reporting features
├── pages/                # Page-level components
├── shared/               # Shared utilities and types
│   ├── api/             # API client and services
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
└── widgets/              # Complex reusable components
```

## 📚 Documentation

- **[Project Structure](FOLDER_STRUCTURE.md)** - Detailed project organization
- **[Features Documentation](docs/features/)** - Feature-specific documentation
  - [Daily Reports](docs/features/DAILY_REPORTS_INTEGRATION_COMPLETE.md)
  - [Registration System](docs/features/REGISTRATION.md)
  - [Real-time Management](docs/features/REALTIME_PROJECT_MANAGEMENT.md)
  - [Master Plan Integration](docs/features/MASTER_PLAN_INTEGRATION_SUMMARY.md)
- **[Technical Docs](docs/)** - Technical implementation details
  - [404 & Protected Routes](docs/404_AND_PROTECTED_ROUTES.md)
  - [PDF Reports](docs/PDF_REPORTS.md)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.