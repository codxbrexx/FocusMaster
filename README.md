# FocusMaster
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=black)
![Node](https://img.shields.io/badge/backend-Node.js-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb&logoColor=white)

> A unified dashboard designed to maximize your cognitive potential and maintain flow state.

[Features](#key-features) • [Stack](#tech-stack) • [Quick Start](#quick-start) • [Docs](./docs)

---

### Key Features
- **Pomodoro Timer**: Customizable intervals, visual progress rings, and notification sounds.
- **Kanban Board**: Drag-and-drop workflow tracking with custom tags and priority levels.
- **Deep Analytics**: Interactive productivity heatmap, trends, and session logs.
- **Integrations**: Spotify Premium controller and secure Google OAuth sign-in.
- **Admin Panel**: User role management (RBAC), audit logs, and system metrics.

### Tech Stack
| Frontend | Backend | DevOps & Database |
|---|---|---|
| React 19 + TypeScript | Node.js + Express 5 | MongoDB (Mongoose ODM) |
| Tailwind CSS 4 + Framer Motion | JWT Auth & Google OAuth | Vercel (CI/CD Deployments) |
| Zustand + Shadcn/ui | Jest & Supertest | Vitest + Playwright (E2E) |

---

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/codxbrexx/FocusMaster.git && cd FocusMaster
```

2. **Start Backend:**
```bash
cd backend && npm install && npm run dev
```
*Configure `backend/.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, and Spotify credentials.*

3. **Start Frontend:**
```bash
cd frontend && npm install && npm run dev
```
*Configure `frontend/.env` with `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`.*

---

### Development & Resources
- **Testing**: Run `npm test` in the respective `frontend` or `backend` folder.
- **Documentation**: Comprehensive guides and specifications are in the [`docs/`](./docs) folder.

---
**Developer:** [@codxbrexx](https://github.com/codxbrexx) • **License**: MIT
