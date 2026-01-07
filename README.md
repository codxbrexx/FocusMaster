# FocusMaster 🧠⚡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=black)
![Node](https://img.shields.io/badge/backend-Node.js-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb&logoColor=white)

**FocusMaster** is a comprehensive productivity ecosystem designed to help you achieve and maintain the "Flow State". By integrating essential tools like a Pomodoro timer, Kanban task manager, deep analytics, and Spotify control into a single, cohesive dashboard, FocusMaster reduces context switching and maximizes your cognitive potential.

![FocusMaster Dashboard](/frontend/public/dashboard.png)

## 🎨 Design Philosophy

FocusMaster is built with a **"Flow First"** design philosophy.
- **Visuals**: Uses a distraction-free 60-30-10 color rule with a deep blue primary theme to induce calmness and focus.
- **Typography**: **Space Grotesk** for impactful headers and **Inter** for high readability in UI elements.
- **Architecture**: A modular, component-driven design ensures scalability and maintainability.

## ✨ Features

### 🍅 Pomodoro Timer
- Customizable focus intervals (25/50 mins) with short and long breaks.
- Visual progress rings and audio notifications.

### 📋 Kanban Task Manager
- Drag-and-drop interface for managing tasks.
- Columns for 'To Do', 'In Progress', and 'Done'.
- Tagging and priority levels.

### 📊 Deep Analytics
- Visualize productivity trends over time.
- Heatmaps of high-activity periods.
- Detailed session logs to track where your time goes.

### 🎵 Spotify Integration
- Control your music directly from the dashboard.
- Play, pause, and skip tracks without leaving your workflow.
- Requires Spotify Premium.

### 👤 User Authentication
- Secure signup and login using JWT.
- Google OAuth integration for one-click access.
- Guest mode for trying out the app instantly.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (via Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: Zustand, React Query
- **Icons**: Lucide React
- **Components**: Shadcn/ui

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), Google OAuth Library

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or Atlas URI)
- Spotify Developer Account (for Music features)
- Google Cloud Console Project (for Auth features)

### Environmental Variables

You need to create `.env` files in both the `backend` and `frontend` directories.

#### Backend (`/backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb://localhost:27017/focusmaster` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | Secret for signing tokens | `your_super_secret_key` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google | `....apps.googleusercontent.com` |
| `SPOTIFY_CLIENT_ID` | OAuth Client ID from Spotify | `your_spotify_client_id` |
| `SPOTIFY_CLIENT_SECRET` | OAuth Client Secret from Spotify | `your_spotify_client_secret` |
| `SPOTIFY_REDIRECT_URI` | Redirect URI for Spotify Auth | `http://localhost:5000/api/spotify/callback` |

#### Frontend (`/frontend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | URL of the Backend API | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID from Google | `....apps.googleusercontent.com` |

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/codxbrexx/FocusMaster.git
    cd FocusMaster
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create your .env file here based on the table above
    npm run dev
    ```

3.  **Setup Frontend**
    Open a new terminal window:
    ```bash
    cd frontend
    npm install
    # Create your .env file here based on the table above
    npm run dev
    ```

4.  **Running Tests**
    To run the unit tests for the frontend:
    ```bash
    cd frontend
    npm test
    ```

5.  **Access the App**
    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
