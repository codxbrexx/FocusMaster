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
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Middleware
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: true,
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
app.use('/api/seed', seedRoutes); 
app.use('/api/feedback', feedbackRoutes);

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
