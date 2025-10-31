import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDb } from './src/utils/connectDb.js';
import userRoutes from './src/routes/user.route.js';
import jobRoutes from './src/routes/job.route.js';
import resumeRoutes from './src/routes/resume.route.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // for local dev
  'https://resume-analyzer-frontend-1gog.onrender.com' // production frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/resume', resumeRoutes);

// Health check route (optional)
app.get('/', (req,res) => res.send('Backend is running!'));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  connectDb();
});
