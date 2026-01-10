# FocusMaster Backend API

The backend for **FocusMaster** is a robust Node.js/Express application that provides secure authentication, data durability, and integrations with third-party services like Spotify and Google.

## 🧱 Architecture

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: 
  - JWT (JSON Web Tokens) for session management.
  - HttpOnly cookies for secure token storage.
  - Google OAuth 2.0.

## 🔐 Security Features

- **CORS Config**: Strict CORS policies allowing only specific frontend origins.
- **Secure Cookies**: Tokens are stored in HttpOnly, Secure cookies to prevent XSS theft.
- **Input Validation**: Mongoose schemas ensure data integrity.
- **Password Hashing**: Bcrypt is used for hashing passwords.

## 🛠️ Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in this directory with the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/focusmaster
   NODE_ENV=development
   JWT_SECRET=your_secure_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
   FRONTEND_URL=http://localhost:5173
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Login with email/password.
- `POST /google`: Login/Register with Google.
- `POST /logout`: Clear session cookies.
- `GET /me`: Get current user profile.

### Tasks (`/api/tasks`)
- `GET /`: Get all tasks.
- `POST /`: Create a task.
- `PUT /:id`: Update a task.
- `DELETE /:id`: Delete a task.

### Admin (`/api/admin`)
- `GET /stats`: Get system-wide statistics (Admin only).
- `GET /users`: Manage users (Admin only).

## 🧪 Testing

The backend uses **Jest** and **Supertest** for integration testing.
- `tests/auth.test.js`: Validates authentication flows.
- `tests/task.test.js`: Validates task CRUD operations.
- `tests/admin.test.js`: Validates admin privileges and endpoints.
