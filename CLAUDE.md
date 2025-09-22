# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build the application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code linting

## Project Architecture

This is a Next.js 15 React application built for infrastructure flow monitoring with AI analysis. The project uses the App Router and modern React patterns.

### Core Structure

- **Next.js App Router**: Uses the `src/app/` directory structure with layout.tsx and page.tsx
- **Component-based Architecture**: Organized into logical folders under `src/components/`
- **TypeScript Types**: Centralized type definitions in `src/types/index.ts`
- **API Routes**: Server-side API endpoints in `src/app/api/`

### Key Technologies

- **Next.js 15** with Turbopack for fast development
- **React 19** with hooks and client components
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Anthropic AI SDK** for AI analysis features
- **Lucide React** for icons
- **Recharts** for data visualization

### Application Domain

This is an infrastructure monitoring system for storm drain management with:

- **Real-time sensor monitoring** (water levels, debris, flow rates)
- **AI-powered risk analysis** and predictions
- **Maintenance task management** with route optimization
- **Weather integration** for predictive analytics
- **Map visualization** using Kakao Maps
- **Alert and notification system**

### Component Organization

- `src/components/layout/` - Layout components (Header, Sidebar, Layout)
- `src/components/dashboard/` - Dashboard views and widgets
- `src/components/map/` - Map-related components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and mock data

### Data Flow

- Main application state managed in `src/app/page.tsx`
- Real-time data simulation with 5-second intervals
- Mock data generation through `src/lib/mockData.ts`
- API routes for external integrations (weather, AI analysis)

### Key Interfaces

Core data structures defined in `src/types/index.ts`:
- `SensorData` - Real-time infrastructure sensor measurements
- `MaintenanceTask` - Work order and route management
- `WeatherData` - Weather conditions and forecasts
- `DashboardStats` - Aggregated system statistics

### Styling Approach

- Uses Tailwind CSS with a dark theme (slate-900 background)
- Custom CSS classes for control panels and components
- Responsive design with grid layouts
- Status-based color coding (green/yellow/red for normal/warning/critical)