# FocusMaster 🧠⚡

**FocusMaster** is a comprehensive productivity ecosystem designed to help you achieve the "Flow State". It integrates essential tools like a Pomodoro timer, Kanban task manager, deep analytics, and Spotify control into a single, beautiful dashboard.

![FocusMaster Dashboard](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop) 
*(Replace with actual screenshot)*

## ✨ Features

- **🍅 Pomodoro Timer**: Customizable focus intervals with short/long breaks.
- **📋 Kanban Task Manager**: Organize tasks with drag-and-drop ease.
- **📊 Deep Analytics**: Visualize productivity trends, heatmaps, and session logs.
- **🎵 Spotify Integration**: Control your focus music without leaving the app.
- **⏱️ Time Tracking**: Clock In/Out system to track work hours.
- **👤 Authentication**: Secure user accounts with JWT.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Shadcn/ui, Lucide React
- **State Management**: Zustand, React Query

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or Local MongoDB

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
    cp .env.example .env # Configure your MONGO_URI and JWT_SECRET
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🎨 Design Philosophy

FocusMaster is built with a **"Flow First"** design philosophy using standard aesthetic fonts like **Inter** for readability and **Space Grotesk** for impactful headings. The UI aims to be distraction-free yet visually rich.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
