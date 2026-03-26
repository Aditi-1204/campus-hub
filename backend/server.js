require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');
const placementRoutes = require("./routes/placementRoutes");


// ─── Validate required env variables before starting ────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`[STARTUP ERROR] Missing environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost port in development
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin))
      return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/placements', placementRoutes);

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Connect DB and start server ─────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('[DB CONNECTION ERROR]', err.message);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => console.warn('[DB] MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('[DB] MongoDB reconnected'));
