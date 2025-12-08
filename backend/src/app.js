const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const workLogRoutes = require('./routes/workLogRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const llmRoutes = require('./routes/llmRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();

// Middleware
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow explicitly configured origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow Vercel deployments automatically
    if (origin && origin.endsWith('.vercel.app')) return callback(null, true);

    // In development allow any localhost:<port> origin so Vite's dynamic ports don't block requests
    if (process.env.NODE_ENV !== 'production') {
      try {
        const u = new URL(origin);
        if ((u.hostname === 'localhost' || u.hostname === '127.0.0.1') && /^[0-9]+$/.test(u.port)) {
          return callback(null, true);
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/clock', workLogRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/seed', seedRoutes); // Mounted seed route

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('FocusMaster API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
