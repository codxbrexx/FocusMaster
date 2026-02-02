# FocusMaster

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=black)
![Node](https://img.shields.io/badge/backend-Node.js-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb&logoColor=white)

> A comprehensive productivity ecosystem designed to help you achieve and maintain the "Flow State"

**FocusMaster** integrates essential productivity tools—Pomodoro timer, Kanban task manager, deep analytics, and Spotify control—into a single, cohesive dashboard. By reducing context switching and streamlining your workflow, FocusMaster maximizes your cognitive potential and helps you maintain focus.

![FocusMaster Dashboard](/frontend/public/dashboard.png)

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Security](#security)
- [License](#license)

## Design Philosophy

FocusMaster is built with a **"Flow First"** design philosophy:

- **Visuals**: Distraction-free 60-30-10 color rule with a deep blue primary theme to induce calmness and focus
- **Typography**: Space Grotesk for impactful headers and Inter for high readability in UI elements
- **Architecture**: Modular, component-driven design ensures scalability and maintainability

## Features

### Pomodoro Timer
- Customizable focus intervals (25/50 mins) with short and long breaks
- Visual progress rings and audio notifications
- Session tracking with mood indicators

### Kanban Task Manager
- Drag-and-drop interface for managing tasks
- Columns for 'To Do', 'In Progress', and 'Done'
- Tagging and priority levels
- Task completion tracking

### Deep Analytics
- Visualize productivity trends over time
- Heatmaps of high-activity periods
- Detailed session logs to track where your time goes
- Performance metrics and insights

### Spotify Integration
- Control your music directly from the dashboard
- Play, pause, and skip tracks without leaving your workflow
- Requires Spotify Premium account

### User Authentication
- Secure signup and login using JWT
- Google OAuth integration for one-click access
- Guest mode for trying out the app instantly
- Role-based access control (RBAC)

### Admin Dashboard
- Comprehensive system management panel
- User management (RBAC, bans, verification)
- Real-time audit logs and live user tracking
- System health monitoring
- Error logging and analytics

## Technology Stack

### Frontend
- **Framework**: [React 19.2](https://reactjs.org/) (via Vite)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: Zustand, React Query
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js 5.2](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), Google OAuth Library
- **Testing**: Jest, Supertest

### DevOps
- **Hosting**: Vercel
- **Database**: MongoDB Atlas
- **Version Control**: Git & GitHub
- **CI/CD**: Vercel (automated deployments)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (Local instance or Atlas URI)
- Spotify Developer Account (optional, for music features)
- Google Cloud Console Project (for OAuth authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codxbrexx/FocusMaster.git
   cd FocusMaster
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file with required environment variables
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   # Create .env file with required environment variables
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`

### Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

For detailed setup instructions, see the [Getting Started Guide](./docs/guides/getting-started.md).

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

- **[API Reference](./docs/api/README.md)** - Complete API endpoint documentation
- **[System Architecture](./docs/architecture/system-overview.md)** - High-level architecture and design
- **[Database Schema](./docs/architecture/database-schema.md)** - MongoDB collections and relationships
- **[Getting Started](./docs/guides/getting-started.md)** - Detailed setup and installation guide
- **[Development Workflow](./docs/guides/development-workflow.md)** - Git workflow and best practices
- **[Troubleshooting](./docs/guides/troubleshooting.md)** - Common issues and solutions
- **[Deployment Guide](./docs/guides/deployment.md)** - Production deployment instructions

## Project Structure

```
FocusMaster/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── admin/         # Admin panel logic
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   └── server.js      # Entry point
│   └── tests/         # Backend tests
├── frontend/          # React + TypeScript app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API services
│   │   ├── context/       # React Context
│   │   └── App.tsx        # Root component
│   └── tests/         # Frontend tests
└── docs/              # Documentation
    ├── api/           # API documentation
    ├── architecture/  # System architecture
    └── guides/        # Setup and usage guides
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## Security

This project follows security best practices:
- **Authentication**: Secure HttpOnly cookies for session management
- **Data Protection**: Strict CORS policies and input validation
- **Dependencies**: Regular security audits (`npm audit`)
- **Environment Variables**: Sensitive data stored in environment variables
- **Role-Based Access Control**: Admin and user role separation

## License

Distributed under the MIT License. See `LICENSE` for more information.

## About

**FocusMaster** was built with modern web technologies and best practices, inspired by the concept of "Flow State" and productivity research. The UI components are built using [Shadcn/ui](https://ui.shadcn.com/).

---

**Developer:** [@codxbrexx](https://github.com/codxbrexx)  
**Repository:** [github.com/codxbrexx/FocusMaster](https://github.com/codxbrexx/FocusMaster)
