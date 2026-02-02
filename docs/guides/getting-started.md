# Getting Started with FocusMaster

This guide will help you set up FocusMaster locally for development.

##  Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Either:
  - Local MongoDB installation, OR
  - MongoDB Atlas account (free tier) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Optional Prerequisites
- **Spotify Developer Account** - For music integration
- **Google Cloud Console Project** - For Google OAuth

---

##  Installation

### 1. Clone the Repository

```bash
git clone https://github.com/codxbrexx/FocusMaster.git
cd FocusMaster
```

### 2. Install Root Dependencies (Optional)

```bash
npm install
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/focusmaster
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173

# Optional: Spotify Integration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
```

### 4. Setup Frontend

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

##  Configuration

### MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb

# Verify it's running
sudo systemctl status mongodb
```

Your connection string: `mongodb://localhost:27017/focusmaster`

#### Option B: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Use this string in `MONGO_URI`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/focusmaster?retryWrites=true&w=majority`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:5000`
7. Copy the Client ID
8. Add to both backend and frontend `.env` files

### Spotify Integration Setup (Optional)

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Set redirect URI: `http://localhost:5000/api/spotify/callback`
4. Copy Client ID and Client Secret
5. Add to backend `.env` file

---

## 🏃 Running the Application

### Development Mode

You need to run both backend and frontend servers.

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Accessing the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

##  Creating an Admin User (Optional)

To access the admin panel, you'll need an admin account.

### Option 1: Using the Script

```bash
cd backend
node src/scripts/createAdmin.js
```

Follow the prompts to create an admin user.

### Option 2: Manual Database Update

1. Register a normal user account
2. Connect to MongoDB
3. Update the user's role:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

##  Running Tests

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

---

##  Project Structure Quick Tour

```
FocusMaster/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── server.js      # Entry point
│   └── package.json
│
├── frontend/              # React + TypeScript app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API services
│   │   └── App.tsx        # Root component
│   └── package.json
│
└── docs/                  # Documentation
```

---

##  Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is already in use
lsof -i :5000

# Kill the process if needed
kill -9 <PID>

# Check MongoDB connection
mongosh  # or mongo
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -i :5173
```

### Database connection errors
- Verify MongoDB is running: `sudo systemctl status mongodb`
- Check `MONGO_URI` in `.env` file
- Ensure network access in MongoDB Atlas if using cloud

### Environment variables not loading
- Ensure `.env` files are in the correct directories
- Don't commit `.env` files (they're in `.gitignore`)
- Restart the dev servers after changing `.env` files

---

## 📚 Next Steps

Now that you have FocusMaster running:

1. Explore the [API Documentation](../api/README.md)
2. Read the [Development Workflow](./development-workflow.md)
3. Check out the [Architecture Overview](../architecture/system-overview.md)
4. Review [Testing Guide](./testing.md)
5. Start contributing! See [Contributing Guidelines](../../CONTRIBUTING.md)

---

## 🆘 Need Help?

- **Issues**: Open an issue on [GitHub](https://github.com/codxbrexx/FocusMaster/issues)
- **Documentation**: Check the [docs folder](../)
- **Troubleshooting**: See [Troubleshooting Guide](./troubleshooting.md)

---

**Happy Coding! **
