import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./src/utils/connectDb.js";
import userRoutes from "./src/routes/user.route.js";
import jobRoutes from "./src/routes/job.route.js";
import resumeRoutes from "./src/routes/resume.route.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Correct CORS setup
const corsOptions = {
  origin: [
    "http://localhost:5173", // optional, for local dev
    "https://resume-analyzer-frontend-1gog.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ correct key name
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/resume", resumeRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running successfully on port ${PORT}`);
  connectDb();
});
