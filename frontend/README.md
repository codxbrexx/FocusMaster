# FocusMaster Frontend

This is the React-based frontend for **FocusMaster**, built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Dashboard**: Central hub for productivity stats and tasks.
- **Pomodoro Timer**: Customizable focus timer with audio cues.
- **Task Manager**: Kanban-style task management.
- **Spotify Panel**: Integrated music player (requires Premium).
- **Admin Panel**: "Dark Glass" themed operational console for system management.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand, React Query
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 💻 Development

### Prerequisites

- Node.js v18+
- Backend server running on port 5000

### Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   ```

### 🧪 Testing

We use **Vitest** and **React Testing Library**.

```bash
npm test
```
